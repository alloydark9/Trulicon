import { Router } from "express";
import {vaultCreate, vaultJoin, getVault} from "../controllers/vault.controller.js";

const vaultRouter= Router();

vaultRouter.post("/create", vaultCreate);
vaultRouter.post("/join", vaultJoin);
vaultRouter.get("/:id", getVault);


export default vaultRouter;
