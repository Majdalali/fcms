const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.SECRET_TOKEN;

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Please log in first" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    req.user = decoded; // Store the decoded user information in the request object
    next(); // Call the next middleware or route handler
  });
}

function clientToken(req, res) {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ message: "Token is missing" });
  }

  // Verify the token against your secret key
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid or expired" });
    }

    return res.status(200).json({ message: "Token is valid", decoded });
  });
}

module.exports = { verifyToken, clientToken };
