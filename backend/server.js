import express from "express";

import { PORT } from "./src/config/env.js";
import authRouter from "./src/routes/auth.route.js";

import connectDB from "./src/database/mongoDB.js";
import userRouter from "./src/routes/user.route.js";

import errMiddleware from "./src/middlewares/errorHandler.middleware.js";

import protect from "./src/middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";

// import { recoverCredentials } from "./src/utils/recovery.js";

import { initSocket } from "./src/config/socket.js";
import { createServer } from "http";

import cors from "cors";

const app = express();

const httpServer = createServer(app);

const io = initSocket(httpServer);

const startServer = async () => {
  await connectDB();
  // console.log("Current Recovery Code:", recoverCredentials.code);

  // Cors configuration
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );

  // Pre middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // default route
  app.get("/", (req, res) => {
    res.send("Welcome to Trulicon.");
  });

  // Auth routes
  app.use("/api/v1/auth", authRouter);

  // User routes
  app.use("/api/v1/users", protect, userRouter);
  
  // Error middleware
  app.use(errMiddleware);

  const port = PORT || 3000;

  httpServer.listen(port, () => {
    console.log(`server listening on port: http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
