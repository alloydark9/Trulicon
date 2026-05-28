import {Router } from "express";
import { getUsers, getUser} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/",  getUsers);
userRouter.get("/search", getUser);
userRouter.post("/", (req, res) => res.send({title: "Created user"}));
userRouter.put("/:id", (req, res) => res.send({title: "Update entire user"}));
userRouter.patch("/:id", (req, res) => res.send({title: "Partially update user"}));
userRouter.delete("/:id", (req, res) => res.send({title: "Delete User"}));

export default userRouter;