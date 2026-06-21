import User from "../models/User.model.js";
import Vault from "../models/Vault.model.js";
import { randomString } from "../utils/helpers.js";
import { getIO } from "../config/socket.js";

export const vaultCreate = async (req, res, next) => {
    try {
        let { name } = req.body;
        let code;
        let exists;
        do {
            code = randomString(8);
            exists = await Vault.findOne({ code });
        } while (exists);

        if (name === "undefined" || name === null || name === "")
            name = randomString(16);

        const currentUser = req.user;

        if (currentUser?.currentVault !== null) {
            return res.status(409).json({
                message: "Already in a vault, Please complete that first"
            });
        }

        const newVault = await Vault.create([
            {
                name,
                code,
                members: [currentUser?.id],
                createdBy: currentUser?.id,
                participants: [{ user: currentUser?.id }]
            }
        ]);

        const vault = newVault[0].toObject();

        const user = await User.findByIdAndUpdate(
            currentUser?.id,
            {
                $addToSet: {
                    vaults: vault?._id
                },
                $set: { currentVault: vault?._id }
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        res.status(201).json({
            success: true,
            message: "Vault created successfully",
            data: {
                vault
            }
        });
    } catch (error) {
        next(error);
    }
};

export const vaultJoin = async (req, res, next) => {
    try {
        const { code } = req.body;
        const currentUser = req.user;
        const io = getIO();

        const vault = await Vault.findOneAndUpdate(
            { code },
            {
                $addToSet: {
                    members: currentUser?.id,
                    participants: [{ user: currentUser?.id }]
                },
                $set: { status: "active" }
            },
            {
                new: true,
                runValidators: true
            }
        );
        const user = await User.findByIdAndUpdate(
            currentUser?.id,
            {
                $addToSet: { vaults: vault?._id },
                $set: { currentVault: vault?._id }
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!vault) {
            return res
                .status(404)
                .json({ message: "Cannot find vault by that code" });
        }
        io.to(vault.code).emit("vault:updated");

        res.status(201).json({
            success: true,
            data: {
                vault
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getVault = async (req, res, next) => {
    try {
        const { code } = req.params;

        const vault = await Vault.findOne({ code });

        if (!vault) {
            return res.status(404).json({
                success: false,
                message: "Cannot find vault by that code"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                vault
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getVaultById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const vault = await Vault.findById(id);

        if (!vault) {
            return res.status(404).json({
                success: false,
                message: "Cannot find vault by that id"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                vault
            }
        });
    } catch (error) {
        next(error);
    }
};
