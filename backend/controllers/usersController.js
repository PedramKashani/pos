require("dotenv").config();

const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
exports.registerUser = async (req, res) => {
  const { username, password, full_name, role } = req.body;

  // Input validation
  if (!username || !password || !full_name || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if the username already exists
    const userExists = await pool.query(
      "SELECT * FROM myschema.users WHERE username = $1",
      [username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await pool.query(
      `INSERT INTO myschema.users (username, password, full_name, role) 
       VALUES ($1, $2, $3, $4) RETURNING user_id, username, full_name, role`,
      [username, hashedPassword, full_name, role]
    );

    res
      .status(201)
      .json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: error.message });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    // Check if the user exists in the database
    const userResult = await pool.query(
      "SELECT * FROM myschema.users WHERE username = $1",
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    const user = userResult.rows[0];

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: error.message });
  }
};
