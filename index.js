const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// konekcija na bazu
mongoose.connect("mongodb://mongo:27017/tasks")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("DB error:", err));

// 🔥 PRO model (proširen)
const Task = mongoose.model("Task", {
  title: String,
  completed: { type: Boolean, default: false },
  category: { type: String, default: "General" },
  priority: { type: String, default: "low" },
  createdAt: { type: Date, default: Date.now }
});

// ======================= ROUTES =======================

// GET
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// POST
app.post("/tasks", async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title je obavezan" });
  }

  const task = new Task({
    title: req.body.title,
    category: req.body.category,
    priority: req.body.priority
  });

  await task.save();
  res.status(201).json(task);
});

// PUT
app.put("/tasks/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      completed: req.body.completed,
      category: req.body.category,
      priority: req.body.priority
    },
    { new: true }
  );

  res.json(updated);
});

// DELETE
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Obrisano" });
});

// health
app.get("/health", (req, res) => {
  res.send("API radi 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});