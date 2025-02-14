require('dotenv').config();
const crypto = require('crypto');


const algorithm = 'aes-256-ctr';
const secretKey = process.env.ENCRYPTION_KEY || 'default_secret_key';
const iv = crypto.randomBytes(16); // Random initialization vector

// Encrypt Function
const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`; // Store IV and encrypted text
};

// Decrypt Function
const decrypt = (hash) => {
    const [ivHex, encryptedText] = hash.split(':');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(ivHex, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedText, 'hex')), decipher.final()]);
    return decrypted.toString();
};

module.exports = { encrypt, decrypt };
