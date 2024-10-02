// /routes/productsRoutes.js
const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productController.js");

//map each HTTP request (GET, POST, PUT, DELETE) to the appropriate controller function.

//set up different routes defintions with specific handler functions from product controller 
router.get("/", productsController.getProducts);
router.post("/", productsController.addProduct);
router.put("/:product_id", productsController.updateProduct);
router.delete("/:product_id", productsController.deleteProduct);




module.exports = router;
