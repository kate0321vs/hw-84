import express from "express";
import mongoose from "mongoose";
import User from "../models/User";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
    try{
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
        });
        newUser.generateToken();
        await newUser.save();
        res.send(newUser);
    } catch(err) {
        if(err instanceof mongoose.Error.ValidationError) {
            res.status(400).send(err);
            return;
        }
        next(err);
    }
});

usersRouter.post("/sessions", async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(404).send({error: "Wrong username or password"});
            return;
        }

        const isMatch = await user.checkPassword(req.body.password);
        if (!isMatch) {
            res.status(404).send({error: "Wrong username or password"});
            return;
        }

        user.generateToken();
        await user.save();

        res.send({message: "Username and password correct", user});

    } catch(err) {
        next(err);
    }
});

export default usersRouter;

