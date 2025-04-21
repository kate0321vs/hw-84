import {Schema, Types} from "mongoose";
import User from "./User";

const taskSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'Task',
        required: true,
        validate: [{
            validator: async (value: Types.ObjectId) => {
                const user = await User.findById(value);
                return !!user;
            },
            message: "Task not found",
        }]
    },
    title: {
        type: String,
        require: true
    },
    description: String,
    status: {
        type: String,
        require: true
    }
})