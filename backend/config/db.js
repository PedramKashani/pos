require("dotenv").config(); // Load environment variables

const { Pool } = require("pg");

// Support both connection string (DATABASE_URL) and individual variables
let poolConfig;

if (process.env.DATABASE_URL) {
  // Use connection string if provided (e.g., from Supabase, Heroku, etc.)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    // Add SSL requirement for cloud databases like Supabase
    ssl: process.env.DATABASE_URL.includes("supabase")
      ? { rejectUnauthorized: false }
      : undefined,
  };
} else {
  // Fall back to individual environment variables
  const requiredEnvVars = [
    "DB_USER",
    "DB_HOST",
    "DB_NAME",
    "DB_PASSWORD",
    "DB_PORT",
  ];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error(
      "Missing required environment variables:",
      missingVars.join(", ")
    );
    console.error(
      "Please provide either DATABASE_URL or individual DB_* variables in your .env file."
    );
    process.exit(1);
  }

  poolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  };
}

const pool = new Pool(poolConfig);

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Database connected successfully");
  release();
});

module.exports = pool;
