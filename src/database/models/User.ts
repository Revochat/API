import mongoose, {Document, Schema} from "mongoose";

export interface RevoUser {
    user_id: string; // the user id is a unique name that is used to identify the user
    token: string;

    username: string; // the username is the name that is displayed to the user
    password: string;
    avatar: string;

    status: "online" | "offline" | "idle" | "dnd";
    updated_at: Date;
    created_at: Date;

    servers: string[];
    channels: string[];
    friends: string[];
    friends_requests_received: string[];
    friends_requests_sent: string[];
}

export interface RevoUserDocument extends RevoUser, Document {}

const RevoUserSchema = new Schema({
    user_id: {type: String, required: true},
    token: {type: String, required: true},

    username: {type: String, required: true},
    password: {type: String, required: true},
    avatar: {type: String, required: false, default: "default"},

    status: {type: String, required: true, default: "offline"},
    updated_at: {type: Date, required: true, default: new Date()},
    created_at: {type: Date, required: true, default: new Date()},

    servers: {type: Array, required: true, default: []},
    channels: {type: Array, required: true, default: []},
    friends: {type: Array, required: true, default: []},
    friends_requests_received: {type: Array, required: true, default: []},
    friends_requests_sent: {type: Array, required: true, default: []},
});

export default mongoose.model<RevoUserDocument>("RevoUser", RevoUserSchema);