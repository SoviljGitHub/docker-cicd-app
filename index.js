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

// model
const Task = mongoose.model("Task", {
  title: String,
});

// ======================= ROUTES =======================

// GET - svi taskovi
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Greška pri čitanju taskova" });
  }
});

// POST - dodaj task
app.post("/tasks", async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: "Title je obavezan" });
    }

    const task = new Task({ title: req.body.title });
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Greška pri čuvanju taska" });
  }
});

// PUT - update task
app.put("/tasks/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Task ne postoji" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Greška pri update-u" });
  }
});

// DELETE - obrisi task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Task ne postoji" });
    }

    res.json({ message: "Uspešno obrisano" });
  } catch (err) {
    res.status(500).json({ error: "Greška pri brisanju" });
  }
});

// health check (profi detalj)
app.get("/health", (req, res) => {
  res.send("API radi 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});