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
        location_id: volunteer.location_id,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

exports.editVolunteerInfo = async (req, res) => {
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

      // Check for unchanged values
      if (
        (req.body.first_name === volunteer.first_name &&
          req.body.last_name === volunteer.last_name &&
          req.body.phone === volunteer.phone &&
          req.body.gender === volunteer.gender &&
          req.body.email === volunteer.email &&
          req.body.date_of_birth === volunteer.date_of_birth,
        req.body.location_id === volunteer.location_id)
      ) {
        return res
          .status(400)
          .send({ success: false, message: "No changes detected in volunteer information" });
      }

      // Validate gender value
      const gender = req.body.gender && req.body.gender.toLowerCase();
      if (gender && !["male", "female", "others"].includes(gender)) {
        return res.status(400).send({
          success: false,
          message: "Invalid gender value. Allowed values: male, female, others",
        });
      }

      // Update the volunteer's information
      const updatedVolunteer = await Volunteer.update(
        {
          first_name: req.body.first_name || volunteer.first_name,
          last_name: req.body.last_name || volunteer.last_name,
          phone: req.body.phone || volunteer.phone,
          gender: gender || volunteer.gender,
          email: req.body.email || volunteer.email,
          date_of_birth: req.body.date_of_birth || volunteer.date_of_birth,
          location_id: req.body.location_id || volunteer.location_id,
        },
        {
          where: {
            volunteer_id: volunteerId,
          },
        }
      );

      if (updatedVolunteer[0] === 0) {
        return res
          .status(400)
          .send({ success: false, message: "Failed to update volunteer information" });
      }

      return res
        .status(200)
        .send({ success: true, message: "Volunteer information updated successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
