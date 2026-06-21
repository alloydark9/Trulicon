import crypto from "crypto";
import fs from "fs";

// Modern Encryption settings
const ALGORITHM = "aes-256-gcm";
const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const IV_LENGTH = 12; // GCM standard IV length is 12 bytes
const SALT_LENGTH = 16;
const TAG_LENGTH = 16; // Auth tag length

// ONLY derives the key from the passphrase and salt
const deriveKey = (pass, salt) => {
    return crypto.pbkdf2Sync(pass, salt, ITERATIONS, KEY_LENGTH, "sha512");
};

// Encryption Function
export const encryptFile = (path, pass) => {
    try {
        const salt = crypto.randomBytes(SALT_LENGTH);
        const iv = crypto.randomBytes(IV_LENGTH); // IV generated per session/file
        const key = deriveKey(pass, salt);

        const fileData = fs.readFileSync(path);

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        const encryptedData = Buffer.concat([
            cipher.update(fileData),
            cipher.final()
        ]);

        // GCM outputs a unique authentication tag automatically
        const authTag = cipher.getAuthTag();

        // Layout: [SALT] [IV] [AUTH_TAG] [ENCRYPTED_DATA]
        const finalPayload = Buffer.concat([salt, iv, authTag, encryptedData]);

        fs.writeFileSync(path, finalPayload);
    } catch (error) {
        throw new Error(`Encryption Error: ${error.message}`);
    }
};

// Decryption Function
export const decryptFile = (path, pass) => {
    try {
        const fileData = fs.readFileSync(path);

        // Define byte positions precisely
        const saltEnd = SALT_LENGTH;
        const ivEnd = saltEnd + IV_LENGTH;
        const tagEnd = ivEnd + TAG_LENGTH;

        // Slice the combined payload
        const salt = fileData.subarray(0, saltEnd);
        const iv = fileData.subarray(saltEnd, ivEnd);
        const authTag = fileData.subarray(ivEnd, tagEnd);
        const encryptedData = fileData.subarray(tagEnd);

        // Derive the exact same key using the extracted salt
        const key = deriveKey(pass, salt);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag); // Verifies the file hasn't been tampered with

        const decryptedData = Buffer.concat([
            decipher.update(encryptedData),
            decipher.final()
        ]);

        fs.writeFileSync(path, decryptedData);
    } catch (error) {
        throw new Error(`Decryption Error: ${error.message}`);
    }
};
