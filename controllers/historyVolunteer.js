const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;
const Volunteer = db.volunteers;
const UserVital = db.userVitals;
const decryptData = require("../helpers/encryptHelper");
const Sequelize = require("sequelize");

const historyVolunteer = async (req, res) => {
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
        include: [
          {
            model: UserVital,
            where: { volunteer_id: volunteerId },
            required: true, // Perform an INNER JOIN to get only users with vitals completed
            order: [["datetime", "DESC"]],
            limit: 1, // Fetch only the latest UserVital record for each user
          },
        ],
        order: [["user_id", "DESC"]],
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

        const formattedUser = {
          unique_id: user.user_id,
          ...user.toJSON(),
        };

        formattedUser.aadhaar_number = decryptedAadhaarNumber;
        formattedUser.user_vitals = user.user_vitals;

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
  historyVolunteer,
};
