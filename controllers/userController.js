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
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters, default to 1 if not provided
    const limit = 10; // Number of records to show per page
    const offset = (page - 1) * limit; // Calculate the offset based on the page number

    const users = await User.findAndCountAll({
      limit,
      offset,
    });

    if (users.count === 0) {
      return res.status(404).send({ success: false, message: "No users found" });
    }

    const totalPages = Math.ceil(users.count / limit); // Calculate the total number of pages

    return res.json({
      users: users.rows,
      totalUsers: users.count,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findOne({
      where: { user_id: userId },
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

module.exports = {
  getUserByAadhaarNumber,
  getAllUsers,
  getSingleUser,
};
