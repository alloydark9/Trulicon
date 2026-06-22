import crypto from "crypto";
import fs from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { promisify } from "util";

// Modern Encryption settings
const ALGORITHM = "aes-256-gcm";
const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const IV_LENGTH = 12; // GCM standard IV length is 12 bytes
const SALT_LENGTH = 16;
const TAG_LENGTH = 16; // Auth tag length

// Promisify pbkdf2 so it doesn't block the Node.js event loop
const pbkdf2Async = promisify(crypto.pbkdf2);

// Asynchronously derives the key from the passphrase and salt
const deriveKey = async (pass, salt) => {
    return await pbkdf2Async(pass, salt, ITERATIONS, KEY_LENGTH, "sha512");
};

export const encryptFileStream = async (filePath, pass) => {
    const tempOutputPath = `${filePath}.tmp`;
    
    try {
        // 1. Generate cryptographic materials
        const salt = crypto.randomBytes(SALT_LENGTH);
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = await deriveKey(pass, salt);

        // 2. Create the cipher stream
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        // 3. Create file streams
        const readStream = fs.createReadStream(filePath);
        const writeStream = fs.createWriteStream(tempOutputPath);

        // 4. Safe Stream Composition: Combine metadata and payload sequentially
        const metadataStream = Readable.from([salt, iv]);
        
        // Pipeline 1: Write Salt and IV safely to the temp file
        await pipeline(metadataStream, writeStream, { end: false });

        // Pipeline 2: Append encrypted content chunks to the temp file
        await pipeline(readStream, cipher, writeStream);

        // 5. Get the Auth Tag (only available AFTER pipeline finishes processing)
        const authTag = cipher.getAuthTag();

        // 6. Append the Auth Tag to the very end of the temp file
        await new Promise((resolve, reject) => {
            const finalAppend = fs.createWriteStream(tempOutputPath, { flags: 'a' });
            finalAppend.write(authTag);
            finalAppend.end();
            finalAppend.on('finish', resolve);
            finalAppend.on('error', reject);
        });

        // 7. ATOMIC SWAP: Replace the cleartext file with the encrypted temp file
        await fs.promises.rename(tempOutputPath, filePath);

    } catch (error) {
        // Safe Cleanup: If encryption fails mid-way, destroy the temporary file
        if (fs.existsSync(tempOutputPath)) {
            await fs.promises.unlink(tempOutputPath).catch(() => {});
        }
        throw new Error(`In-Place Encryption Error: ${error.message}`);
    }
};

export const decryptFile = async (filePath, pass) => {
    const tempOutputPath = `${filePath}.tmp`;
    let fd;

    try {
        // 1. Get the total file size to locate the trailing Auth Tag
        const stats = await fs.promises.stat(filePath);
        const fileSize = stats.size;

        // Ensure the file is at least large enough to hold metadata
        const minLength = SALT_LENGTH + IV_LENGTH + TAG_LENGTH;
        if (fileSize < minLength) {
            throw new Error("File is truncated or invalid.");
        }

        // 2. Read the fixed-length headers (Salt and IV) from the start of the encrypted file
        const headerBuffer = Buffer.alloc(SALT_LENGTH + IV_LENGTH);
        fd = await fs.promises.open(filePath, "r");

        await fd.read(headerBuffer, 0, headerBuffer.length, 0);
        const salt = headerBuffer.subarray(0, SALT_LENGTH);
        const iv = headerBuffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);

        // 3. Read the fixed-length Auth Tag from the very end of the encrypted file
        const authTag = Buffer.alloc(TAG_LENGTH);
        const tagPosition = fileSize - TAG_LENGTH;
        await fd.read(authTag, 0, TAG_LENGTH, tagPosition);

        // Close the manual file descriptor early as we are switching to streams
        await fd.close();
        fd = null;

        // 4. Re-derive the key asynchronously using the extracted salt
        const key = await deriveKey(pass, salt);

        // 5. Initialize the decipher and attach the Auth Tag
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        // 6. Create streams for the encrypted data block payload
        const encryptedDataEndPos = tagPosition - 1;
        const readStream = fs.createReadStream(filePath, {
            start: SALT_LENGTH + IV_LENGTH,
            end: encryptedDataEndPos
        });
        const writeStream = fs.createWriteStream(tempOutputPath);

        // 7. Stream data through decipher into temp file. Throws error if tag fails.
        await pipeline(readStream, decipher, writeStream);

        // 8. ATOMIC SWAP: Replace the encrypted file with the clean decrypted temp file
        await fs.promises.rename(tempOutputPath, filePath);

    } catch (error) {
        // Safe cleanup if file descriptor remains open mid-operation
        if (fd) await fd.close();
        
        // Safe Cleanup: If decryption or auth tag check fails, vaporize the temp file
        if (fs.existsSync(tempOutputPath)) {
            await fs.promises.unlink(tempOutputPath).catch(() => {});
        }
        throw new Error(`In-Place Decryption Error: ${error.message}`);
    }
};
