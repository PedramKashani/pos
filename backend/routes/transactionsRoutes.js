// Transaction Routes
const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionsController.js");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Get all transactions/orders
router.get("/", authenticateToken, transactionsController.getTransactions);

// Process checkout
router.post(
  "/checkout",
  authenticateToken,
  transactionsController.processCheckout
);

module.exports = router;
