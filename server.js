// server.js
const express = require("express");
// const bodyParser = require("body-parser");
const productsRoutes = require("./backend/routes/productsRoutes.js");
const transactionRoutes = require("./backend/routes/transactionsRoutes.js");
const userRoutes = require("./backend/routes/userRoutes.js");

// Initialize the Express app
const app = express();
// app.use(bodyParser.json());
// Middleware
app.use(express.json());

// Define routes
app.use("/products", productsRoutes);
app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);

// Export the app for use in index.js
module.exports = app;
