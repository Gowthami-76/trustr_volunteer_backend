var userService = require("../services/UserService")();
var binahService = require("../services/BinahService")();

module.exports.saveBinah = async function (req, res) {
  const user_id = req.query.user_id;
  userService
    .getUserById(user_id, req)
    .then(async function (user) {
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User with provided user_id does not exist",
        });
      } else {
        const vitals = req.body;
        binahService.addUserBinahVitals(user_id, vitals).then(function () {
          return res.status(200).send({ success: true, message: `success` });
        });
      }
    })
    .error(function (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error while saving Binah vitals",
      });
    })
    .catch(function (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error while saving Binah vitals",
      });
    });
};

module.exports.getBinah = async function (req, res) {
  const user_id = req.query.user_id;
  userService
    .getUserById(user_id, req)
    .then(async function (user) {
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User with provided user_id does not exist",
        });
      } else {
        binahService.getUserBinahVitals(user_id).then(function (vitals) {
          return res.status(200).json({ success: true, message: "success", data: vitals });
        });
      }
    })
    .error(function (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error while fetching Binah details",
      });
    })
    .catch(function (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error while fetching Binah details",
      });
    });
};
