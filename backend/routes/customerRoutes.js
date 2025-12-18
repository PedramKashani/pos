// Customer Routes
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { authenticateToken } = require("../middlewares/authMiddleware");
router.get("/", authenticateToken, customerController.getCustomers);
router.post("/", authenticateToken, customerController.addCustomer);
router.put("/:id", authenticateToken, customerController.updateCustomer);

module.exports = router;
