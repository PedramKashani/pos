// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
// const bodyParser = require("body-parser");
const productsRoutes = require("./backend/routes/productsRoutes.js");
const transactionRoutes = require("./backend/routes/transactionsRoutes.js");
const userRoutes = require("./backend/routes/usersRoutes.js");


// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;
// app.use(bodyParser.json());
// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8080", // Specify the frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed methods
    credentials: true, // Allow cookies
  })
);


// Define api routes
app.use("/products", productsRoutes);
app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);

// Export the app for use in index.js
// module.exports = app;

// Serve the frontend files from 'frontend/build' directory (for production)
app.use(express.static(path.join(__dirname, "frontend/build")));

// Catch-all route to serve the frontend index.html for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});