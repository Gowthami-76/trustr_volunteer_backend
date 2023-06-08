const db = require("../models");
const multiparty = require("multiparty");
const User = db.users;

async function enrollPatients(req, res) {
  try {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
      if (err) {
        return response.status(415).send({
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
        date_of_birth,
        enrollment_status,
        volunteer_id,
      } = requestObj;
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
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  enrollPatients,
};
