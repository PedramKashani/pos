// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const productsRoutes = require("./backend/routes/productsRoutes.js");
const transactionRoutes = require("./backend/routes/transactionsRoutes.js");
const userRoutes = require("./backend/routes/usersRoutes.js");
const customerRoutes = require("./backend/routes/customerRoutes");

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Request logging middleware (development only)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    if (
      req.path.startsWith("/transactions") ||
      req.path.startsWith("/products") ||
      req.path.startsWith("/users") ||
      req.path.startsWith("/customers")
    ) {
      console.log(`${req.method} ${req.path}`);
    }
    next();
  });
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Define api routes (must be before static files and catch-all)
app.use("/products", productsRoutes);
app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);
app.use("/customers", customerRoutes);

// Serve the frontend files from 'frontend/build' directory (for production)
app.use(express.static(path.join(__dirname, "frontend/build")));

// Catch-all route to serve the frontend index.html for unknown routes
// This should be last so API routes are matched first
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
