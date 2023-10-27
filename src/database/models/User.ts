import mongoose, {Document, Schema} from "mongoose";

export interface RevoUser {
    user_id: string; // the user id is a unique name that is used to identify the user
    token: string;

    username: string; // the username is the name that is displayed to the user
    password: string;
    premium_expiration: Date | null;
    avatar: string;

    message_privacy: "everyone" | "friends";
    status: "online" | "offline" | "idle" | "dnd";
    updated_at: Date;
    created_at: Date;
    last_connection: Date;

    servers: number[];
    channels: number[];
    friends: number[];
    friends_requests_received: number[];
    friends_requests_sent: number[];
    blocked: number[];
}

export interface RevoUserDocument extends RevoUser, Document {}

const RevoUserSchema = new Schema({
    user_id: {type: String, required: true},
    token: {type: String, required: true},

    username: {type: String, required: true},
    password: {type: String, required: true},
    premium_expiration: {type: Date, required: false, default: null},
    avatar: {type: String, required: false, default: "default"},

    message_privacy: {type: String, required: true, default: "everyone"},
    status: {type: String, required: true, default: "offline"},
    updated_at: {type: Date, required: true, default: new Date()},
    created_at: {type: Date, required: true, default: new Date()},
    last_connection: {type: Date, required: true, default: new Date()},

    servers: {type: Array, required: true, default: []},
    channels: {type: Array, required: true, default: []},
    friends: {type: Array, required: true, default: []},
    friends_requests_received: {type: Array, required: true, default: []},
    friends_requests_sent: {type: Array, required: true, default: []},
    blocked: {type: Array, required: true, default: []},
});

export default mongoose.model<RevoUserDocument>("RevoUser", RevoUserSchema);