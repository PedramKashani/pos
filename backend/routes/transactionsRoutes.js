const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionsController.js");




router.post("/checkout", transactionsController.processCheckout);

module.exports = router;