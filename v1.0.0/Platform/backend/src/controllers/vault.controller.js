import User from "../models/Vault.model.js";
import Vault from "../models/Vault.model.js";
import { randomString } from "../utils/helpers.js";

export const vaultCreate = async (req, res, next) => {
  try {
    const { name } = req.body;
    let code = randomString(8);
    const exists = await Vault.findOne(code);
    while (exists) {
      code = randomString();
    }
    const currentUser = req.user?.id;
    console.log(currentUser);

    const newVault = await Vault.create([
      {
        name,
        code,
        members: [currentUser],
        createdBy: currentUser,
      },
    ]);

    const vault = newVault[0].toObject();

    res.status(201).json({
      success: true,
      message: "Vault created successfully",
      data: {
        vault,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const vaultJoin = async (req, res, next) => {
  try {
    const { code } = req.body;
    const currentUser = req.user?.id;

    const vault = await Vault.findOneAndUpdate(
      { code },
      {
        $addToSet: { members: currentUser },
        $set: {status: "active"}
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!vault)
      return res
        .status(404)
        .json({ message: "Cannot find vault by that code" });

    res.status(201).json({
      success: true,
      vault,
    });
  } catch (error) {
    next(error);
  }
};


export const getVault = async () => {};
