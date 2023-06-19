const express = require("express");
const sequelize = require("sequelize");
const dotenv = require("dotenv").config();
const db = require("./models");
const userRoutes = require("./Routes/userRoutes");
const PORT = process.env.PORT || 8080;
const app = express();
const AWS = require("aws-sdk");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const whoamiController = require("./controllers/whoamiController");
const userController = require("./controllers/userController");
const associatedVolunteer = require("./controllers/associatedVolunteer");
const enrollPatients = require("./controllers/enrollUsers");
const validateToken = require("./middlewares/validateToken");

// Configure the AWS SDK with your access keys
AWS.config.loadFromPath("./environment/aws-config.json");

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
app.use("/api/users", userRoutes);
app.get("/api/whoami", validateToken, whoamiController.getVolunteerInfo);
app.get("/api/users/getUserById", validateToken, userController.getUserByAadhaarNumber);
app.get("/users", userController.getAllUsers);
app.get("/api/users/associated-volunteer", validateToken, associatedVolunteer.getAssociatedUsers);
app.post("/api/add-user", validateToken, enrollPatients.enrollPatients);

app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
