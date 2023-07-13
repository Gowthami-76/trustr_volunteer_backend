const express = require("express");
const sequelize = require("sequelize");
const dotenv = require("dotenv").config();
const db = require("./models");
const userRoutes = require("./Routes/userRoutes");
const PORT = process.env.PORT || 8080;
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Location = db.Location;
const Leader = db.Leader;
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
app.put("/api/whoami", validateToken, whoamiController.editVolunteerInfo);
app.post("/api/enroll", validateToken, enrollPatients.enrollPatients);
app.get("/users", userController.getAllUsers);
app.get("/users/getSingleUser", validateToken, userController.getSingleUser);
app.get("/api/users/getUserById", validateToken, userController.getUserByAadhaarNumber);
app.get(
  "/api/users/associatedVolunteer/:locationId",
  validateToken,
  associatedVolunteer.getAssociatedUsers
);
app.post("/saveVitals", binahController.saveBinah);
app.get("/getVitals", binahController.getBinahData);

// Endpoint for retrieving all locations with associated leaders
app.get("/locations", async (req, res) => {
  try {
    const locations = await db.Location.findAll({
      include: [
        {
          model: db.Leader,
          attributes: {
            exclude: ["createdAt", "updatedAt", "locationId"], // Exclude createdAt and updatedAt fields from the included Leader model
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"], // Exclude createdAt and updatedAt fields from the Location model
      },
    });
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint for retrieving all leaders
app.get("/leaders", async (req, res) => {
  try {
    const leaders = await db.Leader.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"], // Exclude createdAt and updatedAt fields
      },
    });
    res.json(leaders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
