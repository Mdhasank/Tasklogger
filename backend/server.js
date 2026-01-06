const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory task storage
let tasks = [];
let taskIdCounter = 1;

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "TaskLogger API"
  });
});

// Get all tasks with pagination
app.get("/api/tasks", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedTasks = tasks.slice(startIndex, endIndex);
  
  res.json({
    tasks: paginatedTasks,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(tasks.length / limit),
      totalItems: tasks.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < tasks.length,
      hasPrevPage: page > 1
    }
  });
});

// Get a single task by ID
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// Create a new task
app.post("/api/tasks", (req, res) => {
  const { title, description, status, dueDate } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  const newTask = {
    id: taskIdCounter++,
    title,
    description: description || "",
    status: status || "pending",
    dueDate: dueDate || null,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
app.put("/api/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });

  const { title, description, status, dueDate } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (dueDate !== undefined) task.dueDate = dueDate;

  res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

  tasks.splice(taskIndex, 1);
  res.json({ message: "Task deleted" });
});

if (require.main === module) {
  app.listen(5000, () => {
    console.log("Backend running on port 5000");
  });
}

module.exports = app;
