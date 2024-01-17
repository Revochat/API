import mongoose, { Document, Schema } from "mongoose";

export interface IRolePermission {
    server: {
        admin: boolean; // manage server (edit name, icon, etc) and permissions

        messages: {
            send: boolean; // send messages
        };
    };
}

export interface IRole { // This is the interface for the role in the database

    role_id: string;
    role_name: string;
    role_members: string[];
    role_color: string;
    role_position: number;
    role_server_id: string;

    created_at: Date;
    updated_at: Date;

    permissions?: IRolePermission;
}

export interface IRoleModel extends IRole, Document {}

const RoleSchema = new Schema({
    role_id: { type: String, required: true, unique: true, index: true },
    role_name: { type: String, required: true },
    role_members: { type: Array, required: false, default: [] },
    role_color: { type: String, required: true, default: "#000000" },
    role_position: { type: Number, required: true, default: 0 },
    role_server_id: { type: String, required: true },

    created_at: { type: Date, required: true, default: Date.now() },
    updated_at: { type: Date, required: true, default: Date.now() },

    permissions: { type: Object, required: false, default: {} } // permissions for the role
});

export default mongoose.model<IRoleModel>("Role", RoleSchema);