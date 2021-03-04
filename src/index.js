import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import chalk from "chalk";
import winston from "winston";
import Logger from "./utils/logger.js";
import { LoggerStream } from "./utils/logger.js";
import morgan from "morgan";
import passport from "passport";
import UserRoute from "./routes/api/users.js";
import Passport from "./services/passport.js";
dotenv.config(); // load setting from .env file into process.env

const app = express();

app.use(morgan("combined", { stream: LoggerStream }));

const db = process.env.MONGODB_URI;

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>
        Logger.info(chalk.green.bold("🎄 MongoDB connected successfully 🎄"))
    )
    .catch((err) => console.log(err));

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

await Passport(passport);

app.use("/api/users", UserRoute);

app.post("/api/users/profile", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (error, user, info) => {
        if (!user) {
            return res.status(401).json({ token: "Invalid token" });
        } else {
            return res.status(200).json({ token: "Valid token" });
        }
    })(req, res, next);
});

app.listen(port, () =>
    Logger.info(chalk.blue.bold(`🚀 🌏 Server is up and running on port ${port}`))
);