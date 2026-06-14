import { Router } from "express";
import {
  vaultCreate,
  vaultJoin,
  getVault,
  getVaultById,
} from "../controllers/vault.controller.js";

const vaultRouter = Router();

vaultRouter.post("/create", vaultCreate);
vaultRouter.post("/join", vaultJoin);
vaultRouter.get("/:code", getVault);
vaultRouter.get("/id/:id", getVaultById);

export default vaultRouter;
