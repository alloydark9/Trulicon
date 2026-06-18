import { Router } from "express";
import {
    uploadAsset,
    updateAsset,
    deleteAsset
} from "../controllers/asset.controller.js";
import upload from "../config/multer.js";

const assetRouter = Router();

assetRouter.post("/upload", upload.array("asset", 6), uploadAsset);
assetRouter.put("/:id", updateAsset);
assetRouter.delete("/:id", deleteAsset);

export default assetRouter;
