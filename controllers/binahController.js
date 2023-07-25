const db = require("../models");
const UserVital = db.userVitals;
const User = db.users;
const Volunteer = db.volunteers;
const Location = db.Location;
const moment = require("moment");
const decryptData = require("../helpers/encryptHelper");

// module.exports.saveBinah = async (req, res) => {
//   try {
//     const { hr, spo2, br, sl, bp, user_id, volunteer_id } = req.body;

//     // Check if user_id is present
//     if (!user_id) {
//       return res.status(400).send({ success: false, message: "user_id is required" });
//     }

//     // Check if user with the given ID exists
//     const existingUser = await User.findByPk(user_id);
//     if (!existingUser) {
//       return res.status(400).send({ success: false, message: "User not found" });
//     }

//     // Check if volunteer_id is present
//     if (!volunteer_id) {
//       return res.status(400).send({ success: false, message: "volunteer_id is required" });
//     }

//     // Check if volunteer with the given ID exists
//     const existingVolunteer = await Volunteer.findByPk(volunteer_id);
//     if (!existingVolunteer) {
//       return res.status(400).send({ success: false, message: "Volunteer not found" });
//     }

//     // Fetch the location_id from the users table
//     const { location_id } = existingUser;

//     if (!location_id) {
//       return res
//         .status(400)
//         .send({ success: false, message: "Location ID not found in the users table" });
//     }

//     const binahData = await UserVital.create({
//       hr: hr,
//       spo2: spo2,
//       br: br,
//       sl: sl,
//       bp: bp,
//       user_id: user_id,
//       volunteer_id: volunteer_id,
//       location_id: location_id,
//     });

//     return res.status(200).send(binahData);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ success: false, message: "Internal Server Error" });
//   }
// };

// module.exports.getBinahData = async (req, res) => {
//   try {
//     const { user_id } = req.query;

//     if (!user_id) {
//       return res.status(400).send({ success: false, message: "user_id is required" });
//     }

//     const user = await User.findByPk(user_id, {
//       attributes: ["first_name", "aadhaar_number", "date_of_birth", "gender", "phone"],
//     });

//     if (!user) {
//       return res.status(404).send({ success: false, message: "User not found" });
//     }

//     const binahData = await UserVital.findAll({
//       where: { user_id: user_id },
//       attributes: ["id", "user_id", "hr", "spo2", "br", "sl", "bp", "datetime", "location_id"],
//     });

//     if (binahData.length === 0) {
//       return res
//         .status(404)
//         .send({ success: false, message: "No user vitals found for the given user_id" });
//     }

//     const dateOfBirth = moment(user.date_of_birth);
//     const age = moment().diff(dateOfBirth, "years");

//     // Convert the user data to JSON and add the 'age' property
//     const userJson = user.toJSON();
//     userJson.age = age;

//     return res.status(200).json({ user: userJson, binahData });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ success: false, message: "Internal Server Error" });
//   }
// };

// Assuming you have a decrypt helper function named decryptData

module.exports.getBinahData = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).send({ success: false, message: "user_id is required" });
    }

    const user = await User.findByPk(user_id, {
      attributes: ["first_name", "aadhaar_number", "date_of_birth", "gender", "phone"],
    });

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Decrypt the aadhaar_number
    const secretKey = process.env.secretKey;
    const decryptedAadhaarNumber = decryptData.decryptData(user.aadhaar_number, secretKey);

    const binahData = await UserVital.findAll({
      where: { user_id: user_id },
      attributes: ["id", "user_id", "hr", "spo2", "br", "sl", "bp", "datetime", "location_id"],
    });

    if (binahData.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "No user vitals found for the given user_id" });
    }

    const dateOfBirth = moment(user.date_of_birth);
    const age = moment().diff(dateOfBirth, "years");

    // Convert the user data to JSON and add the 'age' property and decrypted aadhaar_number
    const userJson = user.toJSON();
    userJson.age = age;
    userJson.aadhaar_number = decryptedAadhaarNumber;

    return res.status(200).json({ user: userJson, binahData });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports.saveBinah = async (req, res) => {
  try {
    const { hr, spo2, br, sl, bp, user_id, volunteer_id } = req.body;

    if (!user_id) {
      return res.status(400).send({ success: false, message: "user_id is required" });
    }

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

    // Update the vitals_by and vitals_at fields in the users table
    existingUser.vitals_by = volunteer_id;
    existingUser.vitals_at = new Date(); // Set the current datetime
    await existingUser.save();

    const binahData = await UserVital.create({
      hr: hr,
      spo2: spo2,
      br: br,
      sl: sl,
      bp: bp,
      user_id: user_id,
      volunteer_id: volunteer_id,
      location_id: location_id,
    });

    return res.status(200).send(binahData);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
