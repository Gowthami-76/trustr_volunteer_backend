var nconf = require("nconf");

var _ = require("lodash");

nconf

  .argv()

  .env()

  .file({ file: __dirname + "/env/local.env.json" });

var all = {
  env: nconf.get("NODE_ENV") || nconf.get("env") || "development",

  dialect: "postgres",
};

module.exports = _.merge(
  all,

  require("./" + all.env + ".js") || {}
);
