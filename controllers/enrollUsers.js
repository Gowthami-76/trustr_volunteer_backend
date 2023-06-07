const db = require("../models");
const User = db.users;

async function enrollPatients(req, res) {
  try {
    const {
      first_name,
      last_name,
      phone,
      aadhaar_number,
      gender,
      date_of_birth,
      enrollment_status,
      volunteer_id,
    } = req.body;

    const existingUser = await User.findOne({
      where: {
        aadhaar_number: aadhaar_number,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Aadhaar number already exists" });
    }

    const user = await User.create({
      first_name: first_name,
      last_name: last_name,
      phone: phone,
      aadhaar_number: aadhaar_number,
      gender: gender,
      date_of_birth: date_of_birth,
      enrollment_status: enrollment_status,
      volunteer_id: volunteer_id,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  enrollPatients,
};
