const db = require("../models");
const UserVital = db.userVitals;
const User = db.users;
const Volunteer = db.volunteers;
const Location = db.Location;

module.exports.saveBinah = async (req, res) => {
  try {
    const { hr, spo2, br, sl, bp, user_id, volunteer_id } = req.body;

    // Check if user_id is present
    if (!user_id) {
      return res.status(400).send({ success: false, message: "user_id is required" });
    }

    // Check if user with the given ID exists
    const existingUser = await User.findByPk(user_id);
    if (!existingUser) {
      return res.status(400).send({ success: false, message: "User not found" });
    }

    // Check if volunteer_id is present
    if (!volunteer_id) {
      return res.status(400).send({ success: false, message: "volunteer_id is required" });
    }

    // Check if volunteer with the given ID exists
    const existingVolunteer = await Volunteer.findByPk(volunteer_id);
    if (!existingVolunteer) {
      return res.status(400).send({ success: false, message: "Volunteer not found" });
    }

    // Fetch the location_id from the users table
    const { location_id } = existingUser;

    if (!location_id) {
      return res
        .status(400)
        .send({ success: false, message: "Location ID not found in the users table" });
    }

    const binahData = await UserVital.create({
      hr: hr,
      spo2: spo2,
      br: br,
      sl: sl,
      bp: bp,
      user_id: user_id,
      volunteer_id: volunteer_id,
      location_id: location_id, // Assuming the location_id is stored in the "id" field of the location object
    });

    return res.status(200).send(binahData);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports.getBinahData = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).send({ success: false, message: "user_id is required" });
    }

    const binahData = await UserVital.findAll({
      where: { user_id: user_id },
      attributes: ["id", "hr", "spo2", "br", "sl", "bp", "datetime", "location_id"], // Include the location_id attribute
    });

    if (binahData.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "No user vitals found for the given user_id" });
    }

    return res.status(200).json(binahData);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
