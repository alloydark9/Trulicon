import Vault from "../models/Vault.model.js";
import Asset from "../models/Asset.model.js";
import path from "path";
import { fileTypeFromFile } from "file-type";
import { encryptFile, decryptFile } from "../utils/encode.js";
import { ENCODE_PASS } from "../config/env.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import fs from "fs";
import {
    vaultParticipantsTracker,
    checkVaultProgress
} from "../services/vault.service.js";

export const uploadAsset = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Please upload a file" });
        }

        const owner = req.user;

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

                const encryptedFile = encryptFile(file.path, ENCODE_PASS);

                return {
                    name: file.originalname,
                    format,
                    type,
                    size: file.size,
                    localPath: `uploads/${file.filename}`,
                    originalOwner: owner?.id,
                    currentOwner: owner?.id
                };
            })
        );

        const newAsset = await Asset.create([...fileDetails]);

        const asset = newAsset[0].toObject();

        const vault = await Vault.findById(owner?.currentVault);
        if (!vault) {
            return res.status(404).json({
                message: "Vault not found"
            });
        }
        const state = "uploaded";
        await vaultParticipantsTracker(vault, owner, state, true, asset);
        await checkVaultProgress(vault, state, state);

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

export const lockAsset = async (req, res, next) => {
    try {
        const { id } = req.params;

        const asset = await Asset.findById(id);
        const owner = req.user;

        if (!asset) {
            return res.status(400).json({ message: "Asset doesn't exist" });
        }

        const assetPath = asset?.localPath;
        const folderName = asset?.type;

        const upload = await uploadToCloudinary(`../${assetPath}`, folderName);
        // Clean up: Delete local temporary file to free up device space
        try {
            fs.unlinkSync(upload?.localPath);
            console.log(
                `[Cloudinary Clean] Temporary file deleted successfully.`
            );
        } catch (unlinkError) {
            console.warn(
                `[Clean Warning] Could not clear temp file:`,
                unlinkError.message
            );
        }
        if (asset) {
            asset.localPath = null;
            asset.url = upload.url;
            asset.status = "locked";
            asset.vault = owner?.currentVault;

            await asset.save();
        }
        const vault = await Vault.findById(owner?.currentVault);
        if (!vault) {
            return res.status(404).json({
                message: "Vault not found"
            });
        }
        const state = "locked";
        await vaultParticipantsTracker(vault, owner, state, true);
        await checkVaultProgress(vault, state, state);


        res.status(201).json({
            success: true,
            message: "Asset locked successfully",
            data: {
                asset
            }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAsset = async (req, res, next) => {
    // To build
};
