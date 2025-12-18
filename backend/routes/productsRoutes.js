// Product Routes
const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productController.js");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Public route - no authentication required
router.get("/", productsController.getProducts);
router.post("/", authenticateToken, productsController.addProduct);
router.put("/:product_id", authenticateToken, productsController.updateProduct);
router.delete(
  "/:product_id",
  authenticateToken,
  productsController.deleteProduct
);

module.exports = router;
