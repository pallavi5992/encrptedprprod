require("dotenv").config();
var CryptoJS = require("crypto-js");
const crypto = require("crypto");
async function idIntoBase64(id) {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(id),
    process.env.ID_SECRETE_KEY
  ).toString();
  const encoded = CryptoJS.enc.Base64.parse(encrypted).toString(
    CryptoJS.enc.Hex
  );
  return encoded;
}
async function Base64toId(id) {
  const decoded = CryptoJS.enc.Hex.parse(id).toString(CryptoJS.enc.Base64);
  const actualId = CryptoJS.AES.decrypt(
    decoded,
    process.env.ID_SECRETE_KEY
  ).toString(CryptoJS.enc.Utf8);
  return actualId;
}

async function tokenIntoEncrypt(token) {
  const encrypted = await CryptoJS.AES.encrypt(
    token,
    process.env.ID_SECRETE_KEY
  ).toString();
  // const encoded = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Hex);
  return encrypted;
}
async function encryptToToken(token) {
  const actualId = CryptoJS.AES.decrypt(
    token,
    process.env.ID_SECRETE_KEY
  ).toString(CryptoJS.enc.Utf8);
  return actualId;
}

const encryptData = (data) => {
  try {
    // Generate a random key
    const key = crypto.randomBytes(32); // 32 bytes = 256 bits

    // Encryption parameters
    const algorithm = "aes-256-cbc"; // AES encryption with 256-bit key in CBC mode
    const iv = crypto.randomBytes(16); // Initialization vector (random bytes)

    // Convert numerical values to strings
    const dataString = data.toString();

    // Encrypt the data
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(dataString, "utf8", "hex");
    encryptedData += cipher.final("hex");

    // Return the encrypted data along with the key and IV
    return {
      encryptedData: encryptedData,
      key: key.toString("hex"),
      iv: iv.toString("hex"),
    };
  } catch (error) {
    console.error("Error encrypting data:", error);
    return null;
  }
};

const decryptData = (data) => {
  try {
    const { encryptedData, key, iv } = data;
    const algorithm = "aes-256-cbc"; // AES encryption with 256-bit key in CBC mode
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key, "hex"),
      Buffer.from(iv, "hex")
    );
    let decryptedData = decipher.update(encryptedData, "hex", "utf8");
    decryptedData += decipher.final("utf8");
    return decryptedData;
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
};

const decryptDataToActual = (encryptedData) => {
  // Split the encrypted data into its three parts
  const [encryptedDataStr, key, iv] = encryptedData.split('.');

  // Convert key and IV from base64 strings to buffers
  const keyBuffer = Buffer.from(key, 'base64');
  const ivBuffer = Buffer.from(iv, 'base64');

  // Convert encrypted data from base64 string to buffer
  const encryptedDataBuffer = Buffer.from(encryptedDataStr, 'base64');

  // Decrypt the data using key, IV, and the decrypted data buffer
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  let decrypted = decipher.update(encryptedDataBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
console.log(decrypted)
  // Return the decrypted data as a string
  return decrypted.toString();
};

module.exports = {
  idIntoBase64,
  Base64toId,
  tokenIntoEncrypt,
  encryptToToken,
  encryptData,
  decryptData,
  decryptDataToActual
};
