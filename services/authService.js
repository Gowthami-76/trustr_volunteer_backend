// const bcrypt = require("bcrypt");
// const { Volunteer } = require("../models");

// // Register a new volunteer
// exports.registerVolunteer = async (phone) => {
//   try {
//     // Check if the phone number is already registered
//     const existingVolunteer = await Volunteer.findOne({ where: { phone } });

//     if (existingVolunteer) {
//       throw new Error("Phone number already registered");
//     }

//     // Generate a dummy password
//     const dummyPassword = "dummyPassword";

//     // Hash the dummy password
//     const hashedPassword = await bcrypt.hash(dummyPassword, 10);

//     // Create a new volunteer in the database
//     const volunteer = await Volunteer.create({
//       phone,
//       password: hashedPassword,
//     });

//     return volunteer;
//   } catch (error) {
//     throw error;
//   }
// };
