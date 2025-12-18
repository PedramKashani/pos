const pool = require("../config/db");

// Get all transactions/orders
exports.getTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        t.transaction_id,
        t.transaction_total,
        t.transaction_date,
        t.user_id,
        t.customer_id,
        u.username as employee_username,
        u.full_name as employee_name,
        c.first_name as customer_first_name,
        c.last_name as customer_last_name,
        c.email as customer_email
      FROM myschema.transactions t
      LEFT JOIN myschema.users u ON t.user_id = u.user_id
      LEFT JOIN myschema.customers c ON t.customer_id = c.customer_id
      ORDER BY t.transaction_date DESC
      LIMIT 100`
    );

    // Get items for each transaction
    const transactions = await Promise.all(
      result.rows.map(async (transaction) => {
        const itemsResult = await pool.query(
          `SELECT 
            ti.transaction_item_id,
            ti.quantity,
            ti.price,
            p.product_id,
            p.name as product_name,
            p.description as product_description
          FROM myschema.transaction_items ti
          LEFT JOIN myschema.products p ON ti.product_id = p.product_id
          WHERE ti.transaction_id = $1`,
          [transaction.transaction_id]
        );

        return {
          ...transaction,
          items: itemsResult.rows,
        };
      })
    );

    res.status(200).json(transactions);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching transactions:", error);
    }
    res.status(500).json({ error: "Failed to fetch transactions." });
  }
};

exports.processCheckout = async (req, res) => {
  const { items, customer_id } = req.body;
  const user_id = req.user.user_id; // Get user_id from JWT token (logged-in employee)

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

  const client = await pool.connect();

  try {
    // Check if all products exist and have sufficient inventory
    for (const item of items) {
      const { product_id, quantity } = item;

      // Check if the product has enough stock
      const inventoryCheckResult = await client.query(
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

    // Begin transaction
    await client.query("BEGIN");

    // Calculate transaction total
    let transactionTotal = 0;
    for (const item of items) {
      transactionTotal += item.price * item.quantity;
    }

    // Insert into transaction table with user_id (employee) and customer_id (optional)
    const transactionResult = await client.query(
      `INSERT INTO myschema.transactions (user_id, customer_id, transaction_total) VALUES ($1, $2, $3) RETURNING transaction_id`,
      [user_id, customer_id || null, transactionTotal]
    );

    const transactionId = transactionResult.rows[0].transaction_id;

    // Insert each item into the transaction_items table and update inventory
    for (const item of items) {
      const { product_id, quantity, price } = item;

      // Insert into transaction_items table
      await client.query(
        `INSERT INTO myschema.transaction_items (transaction_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
        [transactionId, product_id, quantity, price]
      );

      // Update inventory
      const inventoryResult = await client.query(
        `UPDATE myschema.inventory SET quantity = quantity - $1 WHERE product_id = $2 RETURNING quantity`,
        [quantity, product_id]
      );

      // Check if inventory update was successful
      if (
        inventoryResult.rows.length === 0 ||
        inventoryResult.rows[0].quantity < 0
      ) {
        // Rollback transaction if inventory update fails
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ error: "Insufficient stock for product ID: " + product_id });
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Checkout successful",
      transaction_id: transactionId,
      transaction_total: transactionTotal,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res
      .status(500)
      .json({ error: "Failed to process checkout. Please try again." });
  } finally {
    client.release();
  }
};
