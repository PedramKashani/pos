// /middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  // If there's no token, return an error
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded user information to the request object
    req.user = decoded;
    next(); // Call the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: "Invalid token." });
  }
};
