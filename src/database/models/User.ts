import mongoose, {Document, Schema} from "mongoose";

export interface IUser {
    user_id: string;
    token: string;

    username: string; // the username is the name that is displayed to the user
    password: string;
    avatar: string;

    status: "online" | "offline" | "idle" | "dnd";
    updated_at: Date;
    created_at: Date;

    servers: string[];
    channels: string[] | any[];
    friends: string[];
    friends_requests_received: string[];
    friends_requests_sent: string[];
}

export interface IUserModel extends IUser, Document {}

const RevoUserSchema = new Schema({
    user_id: { type: String, required: false, unique: true },
    token: {type: String, required: true},

    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: String, required: false, default: "default"},

    status: {type: String, required: true, default: "offline"},
    updated_at: {type: Date, required: true, default: Date.now()},
    created_at: {type: Date, required: true, default: Date.now()},

    servers: {type: Array, required: true, default: []},
    channels: {type: Array, required: true, default: []},
    friends: {type: Array, required: true, default: []},
    friends_requests_received: {type: Array, required: true, default: []},
    friends_requests_sent: {type: Array, required: true, default: []},
});


RevoUserSchema.pre<IUserModel>('save', function (next) {
    if (!this.user_id) {
        this.user_id = this._id.toHexString().toString();
    }
    next();
});

export default mongoose.model<IUserModel>("User", RevoUserSchema);