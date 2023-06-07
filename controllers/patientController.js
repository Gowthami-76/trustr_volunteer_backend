const db = require("../models");
const User = db.users;

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender } = req.body;

    // Create a new patient in the users table
    const patient = await User.create({
      name,
      age,
      gender,
    });

    return res.status(201).json({ message: "Patient created successfully", patient });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
