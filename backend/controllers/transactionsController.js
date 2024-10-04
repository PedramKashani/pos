const pool = require("../config/db");

exports.processCheckout = async (req, res) => {
  console.log("Received checkout data:", req.body); 
  const { items } = req.body;
  
  // validate input
  if (
    !items ||
    items.length === 0 ||
    !items.every(
      (item) => item.product_id && item.quantity > 0 && item.price > 0
    )
  ) {
    return res.status(400).json({
      error:
        "Each item must have a valid product_id, a positive quantity, and a positive price.",
    });
  }
  try {
    // Check if all products exist and have sufficient inventory
    for (const item of items) {
      const { product_id, quantity } = item;

      // Check if the product has enough stock
      const inventoryCheckResult = await pool.query(
        `SELECT quantity FROM myschema.inventory WHERE product_id = $1`,
        [product_id]
      );

      if (inventoryCheckResult.rows.length === 0) {
        return res.status(400).json({
          error: `Product ID ${product_id} does not exist in inventory.`,
        });
      }

      if (inventoryCheckResult.rows[0].quantity < quantity) {
        return res.status(400).json({
          error: `Insufficient stock for product ID: ${product_id}. Available stock: ${inventoryCheckResult.rows[0].quantity}.`,
        });
      }
    }

    //begin transaction
    await pool.query("BEGIN");
    //calculate transaction total
    let transactionTotal = 0;
    for (const item of items) {
      transactionTotal += item.price * item.quantity;
    }

    //insert into transaction table
    const transactionResult = await pool.query(
      `INSERT INTO myschema.transactions (transaction_total) VALUES ($1) RETURNING transaction_id`,
      [transactionTotal]
    );

    const transactionId = transactionResult.rows[0].transaction_id;
    // Insert each item into the transaction_items table and update inventory
    for (const item of items) {
      const { product_id, quantity, price } = item;

      // Insert into transaction_items table
      await pool.query(
        `INSERT INTO myschema.transaction_items (transaction_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
        [transactionId, product_id, quantity, price]
      );

      // Update inventory
      const inventoryResult = await pool.query(
        `UPDATE myschema.inventory SET quantity = quantity - $1 WHERE product_id = $2 RETURNING quantity`,
        [quantity, product_id]
      );

      // Check if inventory update was successful
      if (
        inventoryResult.rows.length === 0 ||
        inventoryResult.rows[0].quantity < 0
      ) {
        // Rollback transaction if inventory update fails
        await pool.query("ROLLBACK");
        return res
          .status(400)
          .json({ error: "Insufficient stock for product ID: " + product_id });
      }
      console.log("Updated inventory for product:", product_id);
    }
    await pool.query("COMMIT");
    console.log(
      `Transaction ${transactionId} processed successfully with total amount: ${transactionTotal}`
    );

    res.status(201).json({
      message: "Checkout successful",
      transaction_id: transactionId,
      transaction_total: transactionTotal,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error processing checkout:", error);
    res.status(500).json({ error: error.message });
  }
};
