const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const Volunteer = db.volunteers;

const signup = async (req, res) => {
  try {
    const { phone, password, first_name, last_name, gender } = req.body;
    const data = {
      phone,
      password: await bcrypt.hash(password, 10),
      first_name,
      last_name,
      gender,
    };
    console.log({ phone, password });
    const volunteer = await Volunteer.create(data);

    if (volunteer) {
      let token = jwt.sign({ id: volunteer.id }, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("volunteer", JSON.stringify(volunteer, null, 2));
      console.log(token);
      // Send volunteer details
      return res.status(201).send(volunteer);
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.log(error);
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
      const token = jwt.sign({ id: volunteer.id }, process.env.secretKey, {
        expiresIn: "1d",
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.status(200).send({ volunteer });
    } else {
      return res
        .status(401)
        .send({ success: false, message: "Please Enter the valid password and try again" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  signup,
  login,
};
