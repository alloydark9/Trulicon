import User from "../models/User.model.js";
import Vault from "../models/Vault.model.js";
import Asset from "../models/Asset.model.js";
import path from "path";
import { fileTypeFromFile } from "file-type";
import { encryptFile, decryptFile } from "../utils/encode.js";

const encodePass = "hedkdiueueo2928w7ehdndn";

export const uploadAsset = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Please upload a file" });
        }

        const owner = req.user?.id;

        const fileDetails = await Promise.all(
            req.files.map(async file => {
                const realType = await fileTypeFromFile(file.path);
                const detectedMime = realType
                    ? realType.mime
                    : file.mimetype || "";
                const format = realType
                    ? realType.ext
                    : file.filename?.slice(file.filename?.lastIndexOf(".") + 1);

                let type = "other";
                if (detectedMime.startsWith("image/")) type = "image";
                else if (detectedMime.startsWith("video/")) type = "video";
                else if (detectedMime.startsWith("audio/")) type = "audio";
                else if (
                    detectedMime.startsWith("text/") ||
                    detectedMime.includes("pdf") ||
                    detectedMime.includes("msword") ||
                    detectedMime.includes("officedocument")
                ) {
                    type = "document";
                }

                const encryptedFile = encryptFile(file.path, encodePass);

                return {
                    name: file.originalname,
                    format,
                    type,
                    size: file.size,
                    localPath: `uploads/${file.filename}`,
                    originalOwner: owner,
                    currentOwner: owner
                };
            })
        );

        const newAsset = await Asset.create([...fileDetails]);

        const asset = newAsset[0].toObject();

        res.status(200).json({
            message: "File uploaded successfully",
            data: asset
        });
    } catch (error) {
        next(error);
    }
};

export const updateAsset = async (req, res, next) => {
    // To build
};

export const deleteAsset = async (req, res, next) => {
    // To build
};
