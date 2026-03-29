const API = "http://localhost:3000";

// DARK MODE
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
}

async function loadTasks() {
  const res = await fetch(API + "/tasks");
  let tasks = await res.json();

  const search = document.getElementById("search").value.toLowerCase();
  tasks = tasks.filter(t => t.title.toLowerCase().includes(search));

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const categories = ["General", "Work", "School"];

  let done = 0;

  categories.forEach(cat => {
    const group = document.createElement("div");
    group.className = "task-group";

    const title = document.createElement("h3");
    title.innerText = cat;

    group.appendChild(title);

    const filtered = tasks.filter(t => t.category === cat);

    filtered.forEach(t => {
      if (t.completed) done++;

      const div = document.createElement("div");
      div.className = `card ${t.priority}`;

      div.innerHTML = `
        <div class="left">
          <input type="checkbox" ${t.completed ? "checked" : ""}
            onchange="toggleComplete('${t._id}', ${!t.completed})">

          <span class="${t.completed ? "completed" : ""}">
            ${t.title}
          </span>
        </div>

        <div>
          <button onclick="startEdit('${t._id}', '${t.title}')">✏️</button>
          <button onclick="deleteTask('${t._id}')">❌</button>
        </div>
      `;

      group.appendChild(div);
    });

    list.appendChild(group);
  });

  document.getElementById("stats").innerText =
    `📊 Total: ${tasks.length} | ✔ Done: ${done}`;
}
// ADD
async function addTask() {
  const title = document.getElementById("taskInput").value;
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;

  if (!title) return;

  await fetch(API + "/tasks", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ title, category, priority })
  });

  document.getElementById("taskInput").value = "";
  loadTasks();
}

// DELETE
async function deleteTask(id) {
  if (!confirm("Obrisati task?")) return;

  await fetch(API + "/tasks/" + id, { method: "DELETE" });
  loadTasks();
}

// COMPLETE
async function toggleComplete(id, status) {
  await fetch(API + "/tasks/" + id, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ completed: status })
  });

  loadTasks();
}

// EDIT (inline kao tvoj original)
function startEdit(id, oldTitle) {
  const newTitle = prompt("Izmeni task:", oldTitle);
  if (!newTitle) return;

  fetch(API + "/tasks/" + id, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ title: newTitle })
  }).then(loadTasks);
}

// INIT
loadTheme();
loadTasks();