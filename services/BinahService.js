module.exports = function () {
  var binahModel = require("../models")["user_vitals"];

  return {
    getUserBinahVitals: function (userId) {
      var whereCondition = {
        user_id: userId,
      };
      return binahModel.findAll({
        where: whereCondition,
      });
    },
    addUserBinahVitals: function (vitals) {
      const { hr, spo2, br, sl, bp } = vitals;
      return binahModel.create({
        user_id: userId,
        volunteer_id: volunteerId,
        hr: hr,
        spo2: spo2,
        br: br,
        sl: sl,
        bp: bp,
      });
    },
  };
};
