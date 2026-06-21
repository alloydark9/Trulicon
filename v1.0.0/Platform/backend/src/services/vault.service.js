import mongoose from "mongoose";
import User from "../models/User.model.js";
import { getIO } from "../config/socket.js";

export const expireVault = async vault => {
    try {
        const io = getIO();
        const expiredVaults = await vault.find(
            {
                expiresAt: { $lte: new Date() },
                status: { $ne: "timeout" }
            },
            { _id: 1, members: 1 }
        );

        if (!expiredVaults || expiredVaults.length === 0) {
            return [];
        }

        const vaultIds = expiredVaults.map(vault => vault._id);
        const rawMembers = expiredVaults.flatMap(vault => vault.members || []);

        const uniqueMemberStrings = [
            ...new Set(rawMembers.map(id => id?.toString()))
        ].filter(Boolean);

        const userObjectIds = uniqueMemberStrings.map(
            id => new mongoose.Types.ObjectId(id)
        );

        const userUpdateResult = await User.updateMany(
            { _id: { $in: userObjectIds } },
            { $set: { currentVault: null } }
        );

        const vaultUpdateResult = await vault.updateMany(
            { _id: { $in: vaultIds } },
            { $set: { status: "timeout", code: null } }
        );
        io.to(vault.code).emit("vault:updated");

        return vaultIds;
    } catch (error) {
        console.error(
            `[${new Date().toISOString()}] Error in expirevault process:`,
            error
        );
        throw error;
    }
};

export const vaultParticipantsTracker = async (
    vault,
    user,
    field,
    value,
    asset = null ) => {
    try {
        const io = getIO();
        if (vault) {
            const participant = vault?.participants?.find(
                p => p.user?.toString() === user?._id?.toString()
            );
            if (participant) {
                participant[field] = value;
                await vault.save();
            } else {
                console.warn(`No participant found for user ID: ${user?._id}`);
            }
            if (field === "uploaded" && asset !== null) {
                participant.assets?.push(asset?._id);
                await vault.save();
            } else {
                console.warn(
                    `Error in updating particpant asset: ${asset?._id}`
                );
            }
        }
        io.to(vault.code).emit("vault:updated");
        return vault;
    } catch (error) {
        console.error(
            `[${new Date().toISOString()}] Error in expirevault process:`,
            error
        );
        throw error;
    }
};

export const checkVaultProgress = async (vault, field, state) => {
    const allUploaded = vault.participants.every(p => p[field]);
    const notOne = vault.participants.length > 1;
    const io = getIO();
    if (allUploaded && notOne) {
        vault.status = state;

        await vault.save();
    }
    io.to(vault.code).emit("vault:updated");
    return vault;
};
