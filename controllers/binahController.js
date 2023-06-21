const db = require("../models");
const UserVital = db.userVitals;
const User = db.users;

module.exports.saveBinah = async (req, res) => {
  try {
    const { hr, spo2, br, sdnn, sl, bp, user_id } = req.body;

    // Check if user_id is present
    if (!user_id) {
      return res.status(400).send({ success: false, message: "user_id is required" });
    }

    // Check if user with the given ID exists
    const existingUser = await User.findByPk(user_id);
    if (!existingUser) {
      return res.status(400).send({ success: false, message: "User not found" });
    }

    const binahData = await UserVital.create({
      hr: hr,
      spo2: spo2,
      br: br,
      sdnn: sdnn,
      sl: sl,
      bp: bp,
      user_id: user_id,
    });

    return res.status(201).send(binahData);
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
