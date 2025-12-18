// Product Controller
const pool = require("../config/db");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM myschema.products");
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch products. Please try again." });
  }
};
// Add a product
exports.addProduct = async (req, res) => {
  const { name, description, price, category, initialStock } = req.body;
  if (!name || !description || !price || !category) {
    return res.status(400).json({
      error: "All fields (name, description, price, category) are required.",
    });
  }
  // Validate initialStock
  if (initialStock < 0) {
    return res.status(400).json({ error: "Initial stock cannot be negative." });
  }

  const client = await pool.connect();

  try {
    // Begin a transaction
    await client.query("BEGIN");
    const productResult = await client.query(
      "INSERT INTO myschema.products (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING product_id",
      [name, description, price, category]
    );
    const productId = productResult.rows[0].product_id;
    // Insert the inventory record for the new product
    await client.query(
      "INSERT INTO myschema.inventory (product_id, quantity) VALUES ($1, $2)",
      [productId, initialStock || 0] // Use initialStock from the request, or default to 0
    );

    // Commit the transaction
    await client.query("COMMIT");

    res.status(201).json({
      message: "Product added successfully",
      product: {
        product_id: productId,
        name,
        description,
        price,
        category,
        quantity: initialStock || 0,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Failed to add product. Please try again." });
  } finally {
    client.release();
  }
};

exports.updateProduct = async (req, res) => {
  const { product_id } = req.params;
  const { name, description, price, category, quantity } = req.body;

  // Validate input for quantity (if provided)
  if (quantity !== undefined && quantity < 0) {
    return res.status(400).json({ error: "Quantity cannot be negative." });
  }

  const client = await pool.connect();

  try {
    // Begin the transaction
    await client.query("BEGIN");

    // Update product details
    const productResult = await client.query(
      `UPDATE myschema.products 
       SET name = $1, description = $2, price = $3, category = $4
       WHERE product_id = $5
       RETURNING *`,
      [name, description, price, category, product_id]
    );

    // Check if the product exists
    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Product not found." });
    }

    let updatedInventory = null;

    // Update inventory quantity if quantity is provided
    if (quantity !== undefined) {
      const inventoryResult = await client.query(
        `UPDATE myschema.inventory 
         SET quantity = $1, last_updated = NOW() 
         WHERE product_id = $2 
         RETURNING *`,
        [quantity, product_id]
      );

      // Check if the product exists in the inventory
      if (inventoryResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res
          .status(404)
          .json({ error: "Product not found in inventory." });
      }

      updatedInventory = inventoryResult.rows[0];
    }

    // Commit the transaction
    await client.query("COMMIT");

    // Respond with the updated product and inventory (if applicable)
    res.status(200).json({
      message: "Product updated successfully.",
      product: productResult.rows[0],
      inventory: updatedInventory,
    });
  } catch (error) {
    // Roll back the transaction in case of error
    await client.query("ROLLBACK");
    res
      .status(500)
      .json({ error: "Failed to update product. Please try again." });
  } finally {
    client.release();
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM myschema.products WHERE product_id = $1 RETURNING *`,
      [product_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete product. Please try again." });
  }
};
