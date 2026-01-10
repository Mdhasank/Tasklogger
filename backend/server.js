require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("./models/User");
const Task = require("./models/Task");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch(err => console.error("MongoDB connection error ❌:", err));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Validate that the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({ error: "Invalid session. Please login again." });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

// Health check
app.get("/api/health", async (req, res) => {
  res.json({
    status: "OK",
    service: "TaskLogger API",
    db: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Auth Routes
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || email.split('@')[0]
    });
    
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ 
      token, 
      user: { id: newUser._id, email: newUser.email, name: newUser.name } 
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Protected Task Routes
app.get("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const { status, priority, category, search, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    
    if (search) {
      query.$text = { $search: search };
    }

    const p = parseInt(page);
    const l = parseInt(limit);
    const skip = (p - 1) * l;

    const [tasks, totalItems, statsCounts] = await Promise.all([
      Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(l),
      Task.countDocuments(query),
      Task.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            urgent: { $sum: { $cond: [{ $and: [{ $eq: ["$priority", "high"] }, { $eq: ["$status", "pending"] }] }, 1, 0] } }
          }
        }
      ])
    ]);

    const stats = statsCounts[0] || { total: 0, pending: 0, completed: 0, urgent: 0 };
    delete stats._id;

    res.json({
      tasks: tasks.map(t => ({
        id: t._id,
        userId: t.userId,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        category: t.category,
        dueDate: t.dueDate,
        createdAt: t.createdAt
      })),
      stats,
      pagination: {
        currentPage: p,
        totalPages: Math.ceil(totalItems / l),
        totalItems,
        itemsPerPage: l,
        hasNextPage: skip + l < totalItems,
        hasPrevPage: p > 1
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetching tasks failed" });
  }
});

app.get("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Fetching task failed" });
  }
});

app.post("/api/tasks", authenticateToken, async (req, res) => {
  const { title, description, status, dueDate, priority, category } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const newTask = new Task({
      userId: req.user.id,
      title,
      description: description || "",
      status: status || "pending",
      priority: priority || "medium",
      category: category || "general",
      dueDate: dueDate || null
    });
    
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Creating task failed" });
  }
});

app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { title, description, status, dueDate, priority, category } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { title, description, status, dueDate, priority, category } },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Updating task failed" });
  }
});

app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Deleting task failed" });
  }
});

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

module.exports = app;
