const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;
const Volunteer = db.volunteers;

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
      });

      if (users.length === 0) {
        return res.status(404).send({ success: false, message: "No Associations Found" });
      }

      const formattedUsers = users.map((user) => {
        return {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          aadhaar_number: user.aadhaar_number,
          volunteer_id: user.volunteer_id,
          created_at: user.createdAt,
        };
      });

      return res.status(200).send(formattedUsers);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getAssociatedUsers,
};
