import crypto from "crypto";
import fs from "fs";

// Encryption settings
const algorithm = "aes-256-cbc";
const iterations = 100000;
const keyLength = 32;
const ivLength = 16;

// Function to derive a key & IV from passphrase & salt
const deriving = (pass, salt) => {
    const key = crypto.pbkdf2Sync(pass, salt, iterations, keyLength, "sha512");
    const iv = crypto.randomBytes(ivLength);

    return { key, iv };
};

// Encryption Function
export const encryptFile = (path, pass) => {
    try {
        const salt = crypto.randomBytes(16);
        const { key, iv } = deriving(pass, salt);
        const fileData = fs.readFileSync(path);

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encryptedData = Buffer.concat([
            cipher.update(fileData),
            cipher.final()
        ]);

    fs.writeFileSync(path, Buffer.concat([salt, iv, encryptedData]));
    } catch (error) {
 throw new Error(`Encryption Error: ${error.message}`);
    }
};

// Decryption Function
export const decryptFile = (path, pass) => {
    try {
        const fileData = fs.readFileSync(path);

 const salt = fileData.slice(0, 16);
        const iv = fileData.slice(16, 32);
const encryptedData = fileData.slice(32);

const { key } = deriving(pass, salt);

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
const decryptedData = Buffer.concat([
            decipher.update(encryptedData),
            decipher.final()
        ]);

        fs.writeFileSync(path, decryptedData);
        console.log("File decrypted successfully");
    } catch (error) {
        throw new Error(`Decryption Error: ${error.message}`);
    }
};
