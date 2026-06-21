import express from "express";

import { PORT } from "./src/config/env.js";
import connectDB from "./src/database/mongoDB.js";

import authRouter from "./src/routes/auth.route.js";
import userRouter from "./src/routes/user.route.js";
import vaultRouter from "./src/routes/vault.route.js";
import assetRouter from "./src/routes/asset.route.js";

import errMiddleware from "./src/middlewares/errorHandler.middleware.js";
import arcjetMiddleware from "./src/middlewares/arcjet.middleware.js";

import protect from "./src/middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";

import { activeVaultServices } from "./src/config/cron.js";

// import { recoverCredentials } from "./src/utils/recovery.js";

import { FRONTEND_URL } from "./src/config/env.js";

import { initSocket } from "./src/config/socket.js";
import { createServer } from "http";

import cors from "cors";
import helmet from "helmet";

import cron from "node-cron";

const app = express();
app.use(helmet());

const httpServer = createServer(app);

const io = initSocket(httpServer);

const startServer = async () => {
    await connectDB();
    // console.log("Current Recovery Code:", recoverCredentials.code);

    // Cors configuration
    app.use(
        cors({
            origin: FRONTEND_URL,
            credentials: true
        })
    );

    // Pre middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(arcjetMiddleware);

    app.use("/uploads", express.static("uploads"));

    // Default route
    app.get("/", (req, res) => {
        res.send("Welcome to Trulicon.");
    });

    cron.schedule("* * * * *", () => {
        activeVaultServices();
    });

    // Auth routes
    app.use("/api/v1/auth", authRouter);

    // User routes
    app.use("/api/v1/users", protect, userRouter);

    // Vault routes
    app.use("/api/v1/vaults", protect, vaultRouter);

    // asset routes
    app.use("/api/v1/assets", protect, assetRouter);

    // Error middleware
    app.use(errMiddleware);

    const port = PORT || 3000;

    httpServer.listen(port, () => {
        console.log(`server listening on port: http://localhost:${port}`);
        activeVaultServices();
    });
};

startServer().catch(error => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
