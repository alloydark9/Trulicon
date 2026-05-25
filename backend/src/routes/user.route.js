import {Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => res.send({title: "Users"}));
userRouter.get("/:id", (req, res) => res.send({title: "Trulicon user"}));
userRouter.post("/", (req, res) => res.send({title: "Created user"}));
userRouter.put("/:id", (req, res) => res.send({title: "Update entire user"}));
userRouter.patch("/:id", (req, res) => res.send({title: "Partially update user"}));
userRouter.delete("/:id", (req, res) => res.send({title: "Delete User"}));

export default userRouter;