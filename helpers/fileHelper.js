const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.loadFromPath("./environment/aws-config.json");
const s3 = new AWS.S3();

module.exports.addUserImageS3 = function (bucketName, file, user_id) {
  return new Promise(function (resolve, reject) {
    if (!file) {
      return resolve(true);
    }

    const imageName = file.fieldName + user_id;
    const fileContent = fs.readFileSync(file.path);

    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: fileContent,
    };

    s3.putObject(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Image uploaded successfully. ETag: ${data.ETag}`);
      }
    });
  });
};
