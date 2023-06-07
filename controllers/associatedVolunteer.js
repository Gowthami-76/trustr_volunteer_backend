// const { Volunteer, User } = require('../models');
const db = require("../models");
const User = db.users;
const Volunteer = db.volunteers;

const getAssociatedUsers = async (req, res) => {
  try {
    const volunteerId = req.query.volunteer_id;

    // Find the volunteer
    const volunteer = await Volunteer.findByPk(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // Find all users associated with the volunteer
    const users = await User.findAll({
      where: {
        volunteer_id: volunteerId,
      },
    });

    // Extract the required attributes
    const formattedUsers = users.map((user) => {
      return {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        volunteer_id: user.volunteer_id,
      };
    });

    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAssociatedUsers,
};

//Copied from the server.js
// Endpoint for fetching all users associated with a volunteer
// app.get("/api/users/associated-volunteer", authenticateToken, async (req, res) => {
//     try {
//       const volunteerId = req.query.volunteer_id;

//       // Find the volunteer
//       const volunteer = await Volunteer.findByPk(volunteerId);
//       if (!volunteer) {
//         return res.status(404).json({ message: "Volunteer not found" });
//       }

//       // Find all users associated with the volunteer
//       const users = await User.findAll({
//         where: {
//           volunteer_id: volunteerId,
//         },
//       });

//       // Extract the required attributes
//       const formattedUsers = users.map((user) => {
//         return {
//           user_id: user.user_id,
//           first_name: user.first_name,
//           last_name: user.last_name,
//           volunteer_id: user.volunteer_id,
//         };
//       });

//       return res.status(200).json(formattedUsers);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send("Internal Server Error");
//     }
//   });
