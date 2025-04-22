import express from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import Task from "../models/Task";
import mongoose from "mongoose";
import {ITask} from "../types";

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;

        const statusArr = ["now", "done", "in_progress"];
        if (!statusArr.includes(req.body.status)) {
            res.status(400).send("Invalid status");
            return;
        }
        const newTask = new Task<ITask>({
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
});

tasksRouter.patch("/:id", auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const task = await Task.findOne({_id: req.params.id});
        if (!task) {
            res.status(404).send({error: "Task not found"});
            return;
        }

        if (task.user.toString() !== user._id.toString()) {
            res.status(403).send({error: "Not have permission to edit this note"});
            return;
        }

        if (req.body.title !== undefined) task.title = req.body.title;
        if (req.body.description !== undefined) task.description = req.body.description;
        if (req.body.status !== undefined) task.status = req.body.status;

        await task.save();
        res.send(task)
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(400).send({error: "Incorrect input data provided"});
        }
        next(err)
    }
});

tasksRouter.delete("/:id", auth, async (req, res) => {
    const user = (req as RequestWithUser).user;
    const task = await Task.findOne({_id: req.params.id});
    if (!task) {
        res.status(404).send({error: "Task not found"});
        return;
    }

    if (task.user.toString() !== user._id.toString()) {
        res.status(403).send({error: "Not have permission to delete this task"});
        return;
    }
    await task.deleteOne();
    res.send({message: "Task deleted"})
})

export default tasksRouter;