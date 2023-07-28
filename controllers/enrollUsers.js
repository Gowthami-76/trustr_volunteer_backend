const db = require("../models");
const User = db.users;
const Volunteer = db.volunteers;
const encryptData = require("../helpers/encryptHelper");

async function enrollPatients(req, res) {
  try {
    const {
      first_name,
      phone,
      aadhaar_number,
      gender,
      date_of_birth,
      enrollment_status,
      volunteer_id,
      location_id,
      aadhaar_front,
      aadhaar_back,
      zipcode,
      address,
    } = req.body;

    // Check if volunteer_id is present
    if (!volunteer_id) {
      return res.status(400).send({ success: false, message: "volunteer_id is required" });
    }

    // Check if volunteer with the given ID exists
    const existingVolunteer = await Volunteer.findByPk(volunteer_id);
    if (!existingVolunteer) {
      return res.status(400).send({ success: false, message: "Volunteer not found" });
    }

    // Validate Aadhaar number
    if (!/^\d{12}$/.test(aadhaar_number)) {
      return res
        .status(400)
        .send({ success: false, message: "Aadhaar number should be a valid 12-digit number" });
    }

    const secretKey = process.env.secretKey;
    const encryptedAadhaarNumber = encryptData.encryptData(aadhaar_number, secretKey);

    // const existingUser = await User.findOne({
    //   where: {
    //     aadhaar_number: encryptedAadhaarNumber,
    //   },
    // });

    // if (existingUser) {
    //   return res.status(400).send({ success: false, message: "Aadhaar number already exists" });
    // }

    const dateOfBirth = date_of_birth.split("/").reverse().join("-");
    const user = await User.create({
      first_name: first_name,
      phone: phone,
      aadhaar_number: encryptedAadhaarNumber,
      gender: gender,
      date_of_birth: dateOfBirth,
      enrollment_status: enrollment_status,
      volunteer_id: volunteer_id,
      location_id: location_id,
      aadhaar_front: aadhaar_front,
      aadhaar_back: aadhaar_back,
      zipcode: zipcode,
      address: address,
    });

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  enrollPatients,
};
