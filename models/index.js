//importing modules
const { Sequelize, DataTypes } = require("sequelize");

//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5433
//database name is discover
const sequelize = new Sequelize(
  `postgres://trustrdb:9unSM1TC7g9GGzZLIv@trustrdb.postgres.database.azure.com:5432/volunteerapp-dev`,

  { logging: false, dialect: "postgres" }
);
//checking if connection is done
sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected to discover`);
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//connecting to model
db.volunteers = require("./volunteer")(sequelize, DataTypes);
db.users = require("./user")(sequelize, DataTypes);

//exporting the module
module.exports = db;
