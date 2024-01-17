import mongoose, { Schema } from "mongoose";

export interface IServer { // This is the interface for the server in the database
    server_id: string;
    server_name: string;
    server_icon?: string;
    owner_id: string;
    channels?: number[];
    members: Array<Map<string, string[]>>; // map of user_id: roles_id
    members_count: number;
    updated_at: string;
    created_at: string;
    banned_users?: number[];

    invite_ids?: number[];
    roles: number[];
}

export interface IServerModel extends IServer {} // dont need to extend Document because we're not using mongoose

const ServerSchema = new Schema({
    server_id: { type: String, required: true, unique: true, index: true },
    server_name: { type: String, required: true },
    server_icon: { type: String, required: false, default: "" },
    owner_id: { type: String, required: true, index: true },
    channels: { type: Array, required: false, default: [] },
    members: { type: Array, required: true},
    members_count: { type: Number, required: true, default: 1 },
    updated_at: { type: String, required: true, default: Date.now()},
    created_at: { type: String, required: true, default: Date.now() },
    banned_users: { type: Array, required: false, default: [] },

    invite_ids: { type: Array, required: false, default: [] },
    roles: { type: Array, required: true, default: [] } // permissions for the server
});

export default mongoose.model<IServerModel>("Server", ServerSchema);