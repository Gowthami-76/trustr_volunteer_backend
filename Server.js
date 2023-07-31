const express = require("express");
const sequelize = require("sequelize");
const dotenv = require("dotenv").config();
const db = require("./models");
const userRoutes = require("./Routes/userRoutes");
const PORT = process.env.PORT || 8080;
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const whoamiController = require("./controllers/whoamiController");
const userController = require("./controllers/userController");
const associatedVolunteer = require("./controllers/associatedVolunteer");
const enrollPatients = require("./controllers/enrollUsers");
const validateToken = require("./middlewares/validateToken");
const binahController = require("./controllers/binahController");
const historyVolunteer = require("./controllers/historyVolunteer");
const leaderController = require("./controllers/leaderController");
const locationController = require("./controllers/locationController");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database has been synchronized");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

app.get("/", (req, res) => {
  res.send("Welcome to the Trustr Volunteer App");
});
app.use("", userRoutes);
app.get("/api/whoami", validateToken, whoamiController.getVolunteerInfo);
app.put("/api/whoami", validateToken, whoamiController.editVolunteerInfo);
app.post("/api/enroll", validateToken, enrollPatients.enrollPatients);
app.get("/users", userController.getAllUsers);
app.get("/api/users/getSingleUser", validateToken, userController.getSingleUser);
app.get("/api/users/getUserById", validateToken, userController.getUserByAadhaarNumber);
app.get(
  "/api/users/associatedVolunteer/:locationId",
  validateToken,
  associatedVolunteer.getAssociatedUsers
);
app.post("/saveVitals", binahController.saveBinah);
app.get("/getVitals", binahController.getBinahData);
app.post("/api/updateUserStatus", validateToken, userController.updateUserStatus);
app.get("/api/users/volunteerHistory/", validateToken, historyVolunteer.historyVolunteer);
app.get("/locations", locationController.getLocations);
app.get("/leaders", leaderController.getLeaders);

app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
