import express from "express";
import * as mongoose from "mongoose";
import config from "./config";
import usersRouter from "./routers/users";
import tasksRouter from "./routers/tasks";


const app = express();
const port = 8000;

app.use(express.static("public"));
app.use(express.json());
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });

    process.on("exit", () => {
        mongoose.disconnect()
    })
};

run().catch((err) => console.error(err));