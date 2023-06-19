const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({ success: false, message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.secretKey);
    req.volunteerId = decoded.id; // Set the volunteerId directly on the req object

    next();
  } catch (error) {
    return res.status(401).send({ success: false, message: "Invalid token" });
  }
};

module.exports = validateToken;
