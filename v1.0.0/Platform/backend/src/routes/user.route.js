import {Router } from "express";
import { getUsers, getUser, getUserBySearch} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/",  getUsers);
userRouter.get("/:id", getUser);
userRouter.get("/search", getUserBySearch);
userRouter.post("/", (req, res) => res.send({title: "Created user"}));
userRouter.put("/:id", (req, res) => res.send({title: "Update entire user"}));
userRouter.patch("/:id", (req, res) => res.send({title: "Partially update user"}));
userRouter.delete("/:id", (req, res) => res.send({title: "Delete User"}));

export default userRouter;