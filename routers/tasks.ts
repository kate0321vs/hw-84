import express from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import Task from "../models/Task";
import mongoose from "mongoose";

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const newTask = new Task({
            user: user._id,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        });
        await newTask.save();
        res.send(newTask)
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(400).send({error: "Incorrect input data provided"});
        }
        next(err);
    }
});

tasksRouter.get("/", auth, async (req, res) => {
    try {
        const user = (req as RequestWithUser).user;
        const tasks = await Task.find({user: user._id});
        if (!tasks) {
            res.status(404).send({error: "Tasks not found"});
            return;
        }
        res.send(tasks);
    } catch(err) {
        res.status(500).send(err);
    }
})

export default tasksRouter;