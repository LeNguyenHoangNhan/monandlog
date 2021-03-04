import mongoose from "mongoose";
import User from "../models/User.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import Logger from "../utils/logger.js";
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.PASSPORT_SECRET || "secret";

let Passport = async(passport) => {
    passport.use(
        new JwtStrategy(opts, async(jwtPayload, done) => {
            try {
                const user = await User.findById(jwtPayload.id);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (error) {
                Logger.error(error);
                done(error);
            }
        })
    );
};

export default Passport;