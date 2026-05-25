import express from "express";

import { PORT } from "./src/config/env.js";
import authRouter from "./src/routes/auth.route.js";

import connectDB from "./src/database/mongoDB.js";
import userRouter from "./src/routes/user.route.js";

import errMiddleware from "./src/middlewares/errorHandler.middleware.js";
import cookieParser from "cookie-parser";

import { recoverCredentials } from "./src/utils/recovery.js";

const app = express();

const startServer = async () => {
  await connectDB();
  console.log("Current Recovery Code:", recoverCredentials.code);

  // Pre middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Error middleware
  app.use(errMiddleware);

  // default route
  app.get("/", (req, res) => {
    res.send("Welcome to Trulicon.");
  });

  // Auth routes
  app.use("/api/v1/auth", authRouter);

  // User routes
  app.use("/api/v1/users", userRouter);

  const port = PORT || 3000;

  app.listen(port, () => {
    console.log(`server listening on port: http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
