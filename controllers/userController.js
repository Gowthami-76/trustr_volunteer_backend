const db = require("../models");
const User = db.users;

// Get a single user by Aadhaar number
const getUserByAadhaarNumber = async (req, res) => {
  try {
    const { aadhaarNumber } = req.query;
    const user = await User.findOne({
      where: {
        aadhaar_number: aadhaarNumber,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUserByAadhaarNumber,
  getAllUsers,
};
