import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } from "./env.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// 1. Get the exact directory of this current cloudinary.js file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET
});

export const uploadToCloudinary = async (
    fileFilePath,
    folder = "mern_uploads"
) => {
    try {
        const fileName = path.basename(fileFilePath);

        const absolutePath = path.resolve(__dirname, "../uploads", fileName);

        console.log(`[Cloudinary Debug] Fixed Absolute Path: ${absolutePath}`);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`File completely missing at path: ${absolutePath}`);
        }

        // Check if the file is a PDF
        const isPdf = fileName.toLowerCase().endsWith(".pdf");

        const response = await cloudinary.uploader.upload(absolutePath, {
            folder: folder,
            resource_type: "raw"
        });

        return {
            success: true,
            url: response.secure_url,
            localPath: absolutePath,
            publicId: response.public_id
        };
    } catch (error) {
        console.error("Cloudinary Upload Error Details:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
};

export const deleteFromCloudinary = async publicId => {
    try {
        const response = await cloudinary.uploader.destroy(publicId);
        if (response.result === "ok") {
            return { success: true, message: "Asset deleted successfully" };
        }
        return { success: false, message: response.result };
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
        throw new Error("Failed to delete image from Cloudinary");
    }
};
