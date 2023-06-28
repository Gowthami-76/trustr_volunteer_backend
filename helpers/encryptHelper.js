const crypto = require("crypto");

// Function to encrypt data using a secret key
const encryptData = (data, secretKey) => {
  const cipher = crypto.createCipher("aes-256-cbc", secretKey);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
};

// Function to decrypt data using a secret key
const decryptData = (encryptedData, secretKey) => {
  try {
    const decipher = crypto.createDecipher("aes-256-cbc", secretKey);
    let decryptedData = decipher.update(encryptedData, "hex", "utf8");
    decryptedData += decipher.final("utf8");
    return decryptedData;
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
};

module.exports = {
  encryptData,
  decryptData,
};
