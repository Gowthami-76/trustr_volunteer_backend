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
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

//synchronizing the database and forcing it to false so we dont lose data
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
app.post("/api/add-user", validateToken, enrollPatients.enrollPatients);
app.get("/users", userController.getAllUsers);
app.get("/api/users/getUserById", validateToken, userController.getUserByAadhaarNumber);
app.get("/api/users/associated-volunteer", validateToken, associatedVolunteer.getAssociatedUsers);
app.post("/saveBinah", binahController.saveBinah);
app.get("/getBinah", binahController.getBinahData);
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
