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
    addUserBinahVitals: function (userId, vitals) {
      const { hr, spo2, br, sdnn, sl, bp } = vitals;
      return binahModel.create({
        user_id: userId,
        hr: hr,
        spo2: spo2,
        br: br,
        sdnn: sdnn,
        sl: sl,
        bp: bp,
      });
    },
  };
};
