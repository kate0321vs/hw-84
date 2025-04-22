export interface IUser {
    username: string;
    password: string;
    token: string;
}

export interface ITask {
    user: Types.ObjectId;
    title: string;
    description: string;
    status: string;
}