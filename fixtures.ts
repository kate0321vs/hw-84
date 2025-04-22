import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Task from "./models/Task";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
       await db.dropCollection("tasks");
       await db.dropCollection("users");
    } catch (e) {
        console.log("Collections were not present, skipping drop...");
    }

    const [user1, user2] = await User.create({
        username: "user1",
        password: "password",
        token: crypto.randomUUID()
        }, {
        username: "user2",
        password: "password",
        token: crypto.randomUUID()
        });

    await Task.create({
        user: user1._id,
        title: "title1",
        description: "description1",
        status: 'now',
    }, {
        user: user2._id,
        title: "title2",
        description: "description2",
        status: 'now',
        });

    await db.close()
};

run().catch(console.error);