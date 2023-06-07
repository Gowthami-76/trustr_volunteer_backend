const db = require("../models");
const Volunteer = db.volunteers;

exports.getVolunteerInfo = async (req, res) => {
  console.log({ volunteerId: req.body.volunteer_id });
  try {
    const volunteerId = req.body.volunteer_id;
    if (!volunteerId || isNaN(volunteerId)) {
      return res.status(400).send({ success: false, message: "Volunteer ID is missing" });
    }
    const volunteer = await Volunteer.findOne({
      where: {
        volunteer_id: volunteerId,
      },
      attributes: { exclude: ["password"] },
    });

    if (!volunteer) {
      return res.status(404).send("Volunteer not found");
    }

    return res.status(200).send(volunteer);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

//Copied from the server.js

// Route for volunteer's profile
// app.get("/api/whoami", authenticateToken, async (req, res) => {
//   console.log({ volunteerId: req.body.volunteer_id });
//   try {
//     const volunteerId = req.body.volunteer_id;
//     if (!volunteerId || isNaN(volunteerId)) {
//       return res.status(400).send({ success: false, message: "Volunteer ID is missing" });
//     }
//     const volunteer = await Volunteer.findOne({
//       where: {
//         volunteer_id: volunteerId,
//       },
//       attributes: { exclude: ["password"] },
//     });

//     if (!volunteer) {
//       return res.status(404).send("Volunteer not found");
//     }

//     return res.status(200).send(volunteer);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal Server Error");
//   }
// });
