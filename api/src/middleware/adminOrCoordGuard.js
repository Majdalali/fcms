// check if user is admin or a coordinator through the isAdmin and isCoordinator property in jwt token
const jwt = require("jsonwebtoken");

function adminOrCoordGuard(req, res, next) {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

    // Check if the user is a coordinator or admin
    if (decoded.isCoordinator !== true && decoded.isAdmin !== true) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient privileges." });
    }

    // If the user has the correct role, continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

module.exports = adminOrCoordGuard;
