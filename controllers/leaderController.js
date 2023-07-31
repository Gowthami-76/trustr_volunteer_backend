const db = require("../models");

const getLeaders = async (req, res) => {
  try {
    const leaders = await db.Leader.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.json(leaders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getLeaders,
};
