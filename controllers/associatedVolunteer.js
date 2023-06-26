const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;
const Volunteer = db.volunteers;
const UserVital = db.userVitals;

// const getAssociatedUsers = async (req, res) => {
//   try {
//     const token = req.headers["x-access-token"];

//     if (!token) {
//       return res.status(401).send({ success: false, message: "Token is missing" });
//     }

//     jwt.verify(token, process.env.secretKey, async (err, decodedToken) => {
//       if (err) {
//         return res.status(401).send({ success: false, message: "Token is invalid or expired" });
//       }

//       const volunteerId = decodedToken.id;

//       if (!volunteerId || isNaN(volunteerId)) {
//         return res.status(400).send({ success: false, message: "Volunteer ID is missing" });
//       }

//       const volunteer = await Volunteer.findByPk(volunteerId);
//       if (!volunteer) {
//         return res.status(404).send({ success: false, message: "Volunteer not found" });
//       }

//       const users = await User.findAll({
//         where: {
//           volunteer_id: volunteerId,
//         },
//         attributes: {
//           include: ["aadhaar_front", "aadhaar_back"], // Include the additional fields
//         },
//         include: [
//           {
//             model: UserVital, // Include the UserVital model
//             attributes: { exclude: ["user_id"] }, // Exclude the 'id' field from UserVital model
//           },
//         ],
//       });

//       if (users.length === 0) {
//         return res.status(404).send({ success: false, message: "No Associations Found" });
//       }

//       const formattedUsers = users.map((user) => {
//         const { user_id, ...userData } = user.toJSON();
//         return {
//           unique_id: user_id, // Set user_id as unique_id
//           ...userData, // Include all other fields except user_id
//         };
//       });

//       return res.status(200).send(formattedUsers);
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ success: false, message: "Internal Server Error" });
//   }
// };

// const getAssociatedUsers = async (req, res) => {
//   try {
//     const token = req.headers["x-access-token"];

//     if (!token) {
//       return res.status(401).send({ success: false, message: "Token is missing" });
//     }

//     jwt.verify(token, process.env.secretKey, async (err, decodedToken) => {
//       if (err) {
//         return res.status(401).send({ success: false, message: "Token is invalid or expired" });
//       }

//       const volunteerId = decodedToken.id;

//       if (!volunteerId || isNaN(volunteerId)) {
//         return res.status(400).send({ success: false, message: "Volunteer ID is missing" });
//       }

//       const volunteer = await Volunteer.findByPk(volunteerId);
//       if (!volunteer) {
//         return res.status(404).send({ success: false, message: "Volunteer not found" });
//       }

//       const users = await User.findAll({
//         where: {
//           volunteer_id: volunteerId,
//         },
//         attributes: {
//           include: ["aadhaar_front", "aadhaar_back"],
//         },
//       });

//       if (users.length === 0) {
//         return res.status(404).send({ success: false, message: "No Associations Found" });
//       }

//       const formattedUsers = [];

//       for (const user of users) {
//         const userVitals = await UserVital.findAll({
//           where: {
//             user_id: user.user_id,
//           },
//           raw: true,
//         });

//         const formattedUser = {
//           unique_id: user.user_id,
//           ...user.toJSON(),
//           userVitals,
//         };

//         formattedUsers.push(formattedUser);
//       }

//       return res.status(200).send(formattedUsers);
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ success: false, message: "Internal Server Error" });
//   }
// };

const getAssociatedUsers = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).send({ success: false, message: "Token is missing" });
    }

    jwt.verify(token, process.env.secretKey, async (err, decodedToken) => {
      if (err) {
        return res.status(401).send({ success: false, message: "Token is invalid or expired" });
      }

      const volunteerId = decodedToken.id;

      if (!volunteerId || isNaN(volunteerId)) {
        return res.status(400).send({ success: false, message: "Volunteer ID is missing" });
      }

      const volunteer = await Volunteer.findByPk(volunteerId);
      if (!volunteer) {
        return res.status(404).send({ success: false, message: "Volunteer not found" });
      }

      const users = await User.findAll({
        where: {
          volunteer_id: volunteerId,
        },
        attributes: {
          include: ["aadhaar_front", "aadhaar_back"],
        },
      });

      if (users.length === 0) {
        return res.status(404).send({ success: false, message: "No Associations Found" });
      }

      const formattedUsers = [];

      for (const user of users) {
        const latestUserVital = await UserVital.findOne({
          where: {
            user_id: user.user_id,
          },
          order: [["datetime", "DESC"]],
          raw: true,
        });

        const formattedUser = {
          unique_id: user.user_id,
          ...user.toJSON(),
        };

        formattedUser.user_vitals = latestUserVital ? [latestUserVital] : [];

        formattedUsers.push(formattedUser);
      }

      return res.status(200).send(formattedUsers);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getAssociatedUsers,
};
