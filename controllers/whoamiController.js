const { addToBlacklist, isInBlacklist } = require("../middlewares/tokenBlacklist");
const db = require("../models");
const Volunteer = db.volunteers;
const jwt = require("jsonwebtoken");

exports.getVolunteerInfo = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];

    if (isInBlacklist(token)) {
      return res.status(401).send({ success: false, message: "Token is invalid or expired" });
    }

    jwt.verify(token, process.env.secretKey, async (err, decodedToken) => {
      if (err) {
        return res.status(401).send({ success: false, message: "Token is invalid or expired" });
      }

      const volunteerId = decodedToken.id;

      if (!volunteerId || isNaN(volunteerId)) {
        return res.status(400).send({ success: false, message: "Volunteer ID is missing" });
      }

      const volunteer = await Volunteer.findOne({
        where: {
          volunteer_id: volunteerId,
        },
        attributes: { exclude: ["password"] },
      });

      if (!volunteer) {
        return res.status(404).send({ success: false, message: "Volunteer not found" });
      }

      return res.status(200).send({
        id: volunteer.volunteer_id,
        first_name: volunteer.first_name,
        last_name: volunteer.last_name,
        phone: volunteer.phone,
        gender: volunteer.gender,
        email: volunteer.email,
        date_of_birth: volunteer.date_of_birth,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
