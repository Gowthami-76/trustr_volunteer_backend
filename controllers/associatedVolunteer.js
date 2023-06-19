const db = require("../models");
const User = db.users;
const Volunteer = db.volunteers;

const getAssociatedUsers = async (req, res) => {
  try {
    const volunteerId = req.query.volunteer_id;

    // Find the volunteer
    const volunteer = await Volunteer.findByPk(volunteerId);
    if (!volunteer) {
      return res.status(404).send({ success: false, message: "Volunteer not found" });
    }

    const users = await User.findAll({
      where: {
        volunteer_id: volunteerId,
      },
    });

    if (users.length === 0) {
      return res.status(404).send({ success: false, message: "No Associations Found" });
    }

    const formattedUsers = users.map((user) => {
      return {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        volunteer_id: user.volunteer_id,
      };
    });

    return res.status(200).send(formattedUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getAssociatedUsers,
};

module.exports = {
  getAssociatedUsers,
};
