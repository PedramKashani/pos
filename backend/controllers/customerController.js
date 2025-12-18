// Customer Controller
const pool = require("../config/db");

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM myschema.customers");
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch customers. Please try again." });
  }
};

// Add a new customer
exports.addCustomer = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    address_line_1,
    address_line_2,
    city,
    state,
    postal_code,
    country,
  } = req.body;

  // Basic validation
  if (!first_name || !last_name || !email) {
    return res
      .status(400)
      .json({ error: "First name, last name, and email are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO myschema.customers 
       (first_name, last_name, email, phone_number, address_line_1, address_line_2, city, state, postal_code, country) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        first_name,
        last_name,
        email,
        phone_number,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      return res.status(400).json({ error: "Email already exists." });
    }
    res
      .status(500)
      .json({ error: "Failed to add customer. Please try again." });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email,
    phone_number,
    address_line_1,
    address_line_2,
    city,
    state,
    postal_code,
    country,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE myschema.customers 
       SET first_name = $1, last_name = $2, email = $3, phone_number = $4, 
           address_line_1 = $5, address_line_2 = $6, city = $7, state = $8, postal_code = $9, country = $10, updated_at = CURRENT_TIMESTAMP 
       WHERE customer_id = $11 
       RETURNING *`,
      [
        first_name,
        last_name,
        email,
        phone_number,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      return res.status(400).json({ error: "Email already exists." });
    }
    res
      .status(500)
      .json({ error: "Failed to update customer. Please try again." });
  }
};
