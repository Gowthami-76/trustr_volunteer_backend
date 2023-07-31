const db = require("../models");

const getLocations = async (req, res) => {
  try {
    const location_id = req.query.location_id;
    let locations;
    if (location_id) {
      locations = await db.Location.findOne({
        where: { location_id: location_id },
        include: [
          {
            model: db.Leader,
            attributes: {
              exclude: ["createdAt", "updatedAt", "locationId"],
            },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
    } else {
      locations = await db.Location.findAll({
        include: [
          {
            model: db.Leader,
            attributes: {
              exclude: ["createdAt", "updatedAt", "locationId"],
            },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
    }

    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getLocations,
};
