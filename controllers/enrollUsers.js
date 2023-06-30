const db = require("../models");
const multiparty = require("multiparty");
const fileHelper = require("../helpers/fileHelper");
const User = db.users;
const Volunteer = db.volunteers;
const encryptData = require("../helpers/encryptHelper");

async function enrollPatients(req, res) {
  try {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
      if (err) {
        return res.status(415).send({
          success: false,
          message: "unsupported content-type",
        });
      }
      var requestObj = {};
      var requestFiles = {};
      Object.keys(fields).forEach(function (key) {
        requestObj[key] = fields[key][0];
      });
      Object.keys(files).forEach(function (key) {
        requestFiles[key] = files[key][0];
      });

      const {
        first_name,
        last_name,
        phone,
        aadhaar_number,
        gender,
        height,
        date_of_birth,
        enrollment_status,
        volunteer_id,
      } = requestObj;

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
      // const originalAadhaarNumber = decryptData(encryptedAadhaarNumber, secretKey);
      // console.log(originalAadhaarNumber);

      const existingUser = await User.findOne({
        where: {
          aadhaar_number: encryptedAadhaarNumber,
        },
      });

      // add images to s3 bucket
      if (requestFiles.aadhaar_front) {
        fileHelper.addUserImageS3("volunteerapp", requestFiles.aadhaar_front, aadhaar_number);
      }
      if (requestFiles.aadhaar_back) {
        fileHelper.addUserImageS3("volunteerapp", requestFiles.aadhaar_back, aadhaar_number);
      }

      if (existingUser) {
        return res.status(400).send({ success: false, message: "Aadhaar number already exists" });
      }

      const dateOfBirth = date_of_birth.split("/").reverse().join("-");
      const user = await User.create({
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        aadhaar_number: encryptedAadhaarNumber,
        gender: gender,
        date_of_birth: dateOfBirth,
        enrollment_status: enrollment_status,
        volunteer_id: volunteer_id,
        height: height,
      });

      return res.status(200).send(user);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  enrollPatients,
};
