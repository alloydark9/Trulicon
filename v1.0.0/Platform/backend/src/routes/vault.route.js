import { Router } from "express";
import {vaultCreate, vaultJoin, getVault} from "../controllers/vault.controller.js";

const vaultRouter= Router();

vaultRouter.post("/vault/create", vaultCreate);
vaultRouter.post("/vault/join/:code", vaultJoin);
vaultRouter.get("/vault/:id", getVault);


export default vaultRouter;
