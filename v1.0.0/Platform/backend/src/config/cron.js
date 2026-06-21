import { expireVault } from "../services/vault.service.js";
import Vault from "../models/Vault.model.js";

export const activeVaultServices = async () => {
    console.log("Running Active Vault Services...");
    console.log(await expireVault(Vault));
};
