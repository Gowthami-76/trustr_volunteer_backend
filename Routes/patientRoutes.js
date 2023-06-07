const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

// Route to add a new patient
router.post("/patients", patientController.createPatient);

module.exports = router;
