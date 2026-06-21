import { Router } from "express";
import {
    uploadAsset,
    updateAsset,
    lockAsset,
    deleteAsset
} from "../controllers/asset.controller.js";
import upload from "../config/multer.js";

const assetRouter = Router();

assetRouter.post("/upload", upload.array("asset", 6), uploadAsset);
assetRouter.put("/:id/update", updateAsset);
assetRouter.post("/:id/lock", lockAsset);
assetRouter.delete("/:id/delete", deleteAsset);

export default assetRouter;
