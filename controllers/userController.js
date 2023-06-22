const db = require("../models");
const User = db.users;
const { Op } = require("sequelize");

// Get a single user by Aadhaar number / firstName / lastName / userId

const getUserByAadhaarNumber = async (req, res) => {
  try {
    const { aadhaarNumber, firstName, lastName, userId } = req.query;

    if (!aadhaarNumber && !firstName && !lastName && !userId) {
      return res.status(404).send({ success: false, message: "No user found" });
    }

    let whereClause = {};
    if (aadhaarNumber) {
      whereClause.aadhaar_number = aadhaarNumber;
    }
    if (firstName) {
      whereClause.first_name = { [Op.iLike]: firstName.toLowerCase() };
    }
    if (lastName) {
      whereClause.last_name = { [Op.iLike]: lastName.toLowerCase() };
    }
    if (userId) {
      whereClause.user_id = userId;
    }

    const users = await User.findAll({
      where: whereClause,
    });

    if (users.length === 0) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    return res.json(users);
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
