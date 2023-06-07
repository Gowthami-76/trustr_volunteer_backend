// importing modules
const express = require("express");
const db = require("../models");
// Assigning db.volunteers to Volunteer variable
const Volunteer = db.volunteers;

// Function to check if phone number already exists in the database
const saveUser = async (req, res, next) => {
  try {
    const phone = req.body.phone;

    // Search the database to see if phone number exists
    const existingVolunteer = await Volunteer.findOne({
      where: {
        phone: phone,
      },
    });

    // If phone number exists in the database, respond with a status of 409
    if (existingVolunteer) {
      return res.status(409).send("Phone number already exists");
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

// exporting module
module.exports = {
  saveUser,
};
