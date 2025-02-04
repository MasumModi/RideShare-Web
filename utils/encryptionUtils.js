// /utils/encryptionUtils.js
const crypto = require('crypto');
require('dotenv').config();

const generateEncryptionKey = () => {
  return process.env.ENCRYPTION_KEY 
    ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    : crypto.randomBytes(32);
};

const generateEncryptionIV = () => {
  return process.env.ENCRYPTION_IV 
    ? Buffer.from(process.env.ENCRYPTION_IV, 'hex')
    : crypto.randomBytes(16);
};

const SECRET_KEY = generateEncryptionKey();
const ENCRYPTION_IV = generateEncryptionIV();

const encryptData = (data) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, ENCRYPTION_IV);
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
};

const decryptData = (encryptedData) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, ENCRYPTION_IV);
  return decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8');
};

module.exports = { encryptData, decryptData };
