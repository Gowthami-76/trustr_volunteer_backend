const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;
const Volunteer = db.volunteers;
const UserVital = db.userVitals;
const decryptData = require("../helpers/encryptHelper");

const getAssociatedUsers = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send({ success: false, message: "Token is missing" });
    }

    jwt.verify(token, process.env.secretKey, async (err, decodedToken) => {
      if (err) {
        return res.status(401).send({ success: false, message: "Token is invalid or expired" });
      }

      const volunteerId = decodedToken.id;

      if (!volunteerId || isNaN(volunteerId)) {
        return res.status(400).send({ success: false, message: "Volunteer ID is missing" });
      }

      const volunteer = await Volunteer.findByPk(volunteerId);
      if (!volunteer) {
        return res.status(404).send({ success: false, message: "Volunteer not found" });
      }

      const users = await User.findAll({
        where: {
          volunteer_id: volunteerId,
        },
        attributes: {
          include: ["aadhaar_front", "aadhaar_back"],
        },
      });

      if (users.length === 0) {
        return res.status(404).send({ success: false, message: "No Associations Found" });
      }

      const totalUsersEnrolled = users.length;

      const formattedUsers = [];

      for (const user of users) {
        const decryptedAadhaarNumber = decryptData.decryptData(
          user.aadhaar_number,
          process.env.secretKey
        );

        const latestUserVital = await UserVital.findOne({
          where: {
            user_id: user.user_id,
          },
          order: [["datetime", "DESC"]],
          raw: true,
        });

        const formattedUser = {
          unique_id: user.user_id,
          ...user.toJSON(),
        };

        formattedUser.aadhaar_number = decryptedAadhaarNumber;
        formattedUser.user_vitals = latestUserVital ? [latestUserVital] : [];

        formattedUsers.push(formattedUser);
      }

      const response = {
        total_users_enrolled: totalUsersEnrolled,
        users: formattedUsers,
      };

      return res.status(200).send(response);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getAssociatedUsers,
};
