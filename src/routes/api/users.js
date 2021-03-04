import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Logger from "../../utils/logger.js";
import {
    validateLoginInput,
    validateRegisterInput,
} from "../../services/validator.js";
import User from "../../models/User.js";

const MONGODB_URI = process.env.MONGODB_URI;
const saltRound = process.env.SALT_ROUND || 10;
const jwtSecret = process.env.PASSPORT_SECRET || "secret";

const router = express.Router();

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", async(req, res) => {
    // Validate form
    const { errors, isValid } = validateRegisterInput(req.body);

    if (isValid == false) {
        Logger.info(`Route: /register, error: ${errors} from ${req.ip}`);
        return res.status(400).json(errors);
    }

    try {
        const user = await User.findOne({ email: req.body.email }).exec();
        if (user) {
            return res.status(409).json({ email: "Email already registered" });
        } else {
            const newUser = new User({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
            });

            const salt = await bcrypt.genSalt(saltRound);
            const hashedPassword = await bcrypt.hash(newUser.password, salt);

            newUser.password = hashedPassword;

            const savedUser = await newUser.save();
            return res.status(201).json(savedUser);
        }
    } catch (error) {
        Logger.error(error);
        return res.status(500).send();
    }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", async(req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (isValid == false) {
        Logger.info(`Route: /login, error: ${errors} from ${req.ip}`);
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email });
        if (user == null) {
            return res.status(401).json({ email: "Account not exists" });
        }

        const matched = await bcrypt.compare(password, user.password);
        if (matched) {
            const payload = {
                id: user.id,
                name: user.name,
            };
            jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (error, token) => {
                return res.json({
                    success: true,
                    token: `Bearer ${token}`,
                });
            });
        } else {
            return res.status(401).json({ passport: "Password is incorrect" });
        }
    } catch (error) {
        Logger.error(error);
        return res.status(500).send(error);
    }
});

export default router;