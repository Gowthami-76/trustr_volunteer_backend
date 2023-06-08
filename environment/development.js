module.exports = {
  PORT: "8443",
  dbUrl:
    "postgres://trustrdb:9unSM1TC7g9GGzZLIv@trustrdb.postgres.database.azure.com:5432/volunteerapp-dev",

  mongolia_s3_bucket: "mongolia-trustr-dev",
  alinea_s3_bucket: "alinea-trustr-dev",
  india_s3_bucket: "india-trustr-dev",

  aws: {
    kmsKeyName: "alias/trustr-test",
    kmsKeyId: "133301e7-523b-4d19-95a5-85684042b664",
  },
};
