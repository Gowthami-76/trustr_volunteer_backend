const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const Volunteer = db.volunteers;
const { addToBlacklist } = require("../middlewares/tokenBlacklist");

const signup = async (req, res) => {
  try {
    const { phone, password, first_name, last_name, gender, email, date_of_birth } = req.body;
    const data = {
      phone,
      password: await bcrypt.hash(password, 10),
      first_name,
      last_name,
      email,
      date_of_birth,
      gender,
    };

    const volunteer = await Volunteer.create(data);

    if (volunteer) {
      const token = jwt.sign({ id: volunteer.id }, process.env.secretKey, {
        // expiresIn: "5m",
      });

      // console.log("volunteer", JSON.stringify(volunteer, null, 2));
      // console.log(token);

      return res.status(201).send({ volunteer, token });
    } else {
      return res.status(409).send({ success: false, message: "Details are not correct" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const volunteer = await Volunteer.findOne({
      where: {
        phone: phone,
      },
    });

    if (!volunteer) {
      return res.status(401).send({ success: false, message: "Please enter a valid phone number" });
    }

    const isSame = await bcrypt.compare(password, volunteer.password);

    if (isSame) {
      const token = jwt.sign({ id: volunteer.dataValues.volunteer_id }, process.env.secretKey, {
        // expiresIn: "5m",
      });

      const oldToken = req.headers["x-access-token"];
      addToBlacklist(oldToken);

      console.log("Token ID:", volunteer.dataValues.volunteer_id);

      return res.status(200).send({ volunteer, token: token });
    } else {
      return res
        .status(401)
        .send({ success: false, message: "Please enter the valid password and try again" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
};
