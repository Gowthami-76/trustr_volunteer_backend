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
      return res.status(404).send({ success: false, message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    if (users.length === 0) {
      return res.status(404).send({ success: false, message: "No users found" });
    }

    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getUserByAadhaarNumber,
  getAllUsers,
};
