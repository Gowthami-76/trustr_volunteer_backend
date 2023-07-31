const db = require("../models");
const User = db.users;
const UserVital = db.userVitals;
const { Op } = require("sequelize");
const decryptData = require("../helpers/encryptHelper");
const moment = require("moment");

// Get a single user by Aadhaar number / firstName / lastName / userId

const getUserByAadhaarNumber = async (req, res) => {
  try {
    const { aadhaarNumber, firstName, lastName, userId } = req.query;

    if (!aadhaarNumber && !firstName && !lastName && !userId) {
      return res.status(404).send({ success: false, message: "No user found" });
    }

    let whereClause = {};
    if (aadhaarNumber) {
      // Decrypt the aadhaarNumber
      const decryptedAadhaarNumber = decryptData.decryptData(aadhaarNumber, process.env.secretKey);
      if (decryptedAadhaarNumber === null) {
        return res.status(400).send({ success: false, message: "Invalid aadhaarNumber" });
      }
      whereClause.aadhaar_number = decryptedAadhaarNumber;
    }
    if (firstName) {
      whereClause.first_name = { [Op.iLike]: firstName.toLowerCase() };
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

    const userIds = users.rows.map((user) => user.user_id);

    const userVitals = await UserVital.findAll({
      where: {
        user_id: userIds,
      },
    });

    const userVitalsMap = new Map();
    userVitals.forEach((userVital) => {
      userVitalsMap.set(userVital.user_id, {
        vitals_by: userVital.volunteer_id,
        vitals_at: userVital.datetime,
      });
    });

    const updatedUserIds = [];

    for (const user of users.rows) {
      const decryptedAadhaarNumber = decryptData.decryptData(
        user.aadhaar_number,
        process.env.secretKey
      );

      let status = user.status;
      let registeredBy = user.volunteer_id;
      let address = user.address;
      let zipcode = user.zipcode;
      let vitalsBy = null;
      let vitalsAt = null;

      if (userVitalsMap.has(user.user_id)) {
        const vitalsData = userVitalsMap.get(user.user_id);

        status = "vitals completed";
        vitalsBy = vitalsData.vitals_by;
        vitalsAt = vitalsData.vitals_at;

        if (user.status !== status) {
          await User.update({ status }, { where: { user_id: user.user_id } });
          updatedUserIds.push(user.user_id);
        }
      }

      user.status = status;
      user.aadhaar_number = decryptedAadhaarNumber;
      user.registered_by = registeredBy;
      user.vitals_by = vitalsBy;
      user.vitals_at = vitalsAt;
      user.zipcode = zipcode;
      user.address = address;
    }

    const totalPages = Math.ceil(users.count / limit); // Calculate the total number of pages

    return res.json({
      users: users.rows.map((user) => ({
        ...user.toJSON(),
        registered_by: user.registered_by,
        vitals_by: user.vitals_by,
        vitals_at: user.vitals_at,
      })),
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

    const decryptedAadhaarNumber = decryptData.decryptData(
      user.aadhaar_number,
      process.env.secretKey
    );

    const dateOfBirth = moment(user.date_of_birth);
    const age = moment().diff(dateOfBirth, "years");

    const userVitals = await UserVital.findOne({
      where: { user_id: userId },
      order: [["id", "DESC"]],
    });

    const decryptedUser = {
      ...user.toJSON(),
      aadhaar_number: decryptedAadhaarNumber,
      age: age,
      userVitals: userVitals ? userVitals.toJSON() : {},
    };

    return res.json(decryptedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;
  try {
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    const updatedUser = await User.update({ status }, { where: { user_id: userId } });

    if (updatedUser[0] === 0) {
      return res.status(500).send({ success: false, message: "Failed to update user status" });
    }

    return res.json({ success: true, message: "User status updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getUserByAadhaarNumber,
  getAllUsers,
  getSingleUser,
  updateUserStatus,
};
