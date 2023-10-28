import mongoose, { Document, Schema } from "mongoose";

export interface IRolePermission {
    server: {
        admin: boolean; // manage server (edit name, icon, etc) and permissions

        members: {
            invite: boolean; // invite members
            remove: boolean; // kick members
            ban: boolean; // ban members
            deafen: boolean; // deafen members in voice channels
            mute_voice: boolean; // mute members in voice channels
            mute_chat: boolean; // mute members in chat
            move: boolean; // move members in voice channels
            rename: boolean; // rename members
            roles: boolean; // manage roles (create, delete, edit)
        }

        channels: {
            manage: boolean; // manage channels (create, delete, edit)
            view: boolean; // view channels
            speak: boolean; // speak in voice channels
            video: boolean; // video in voice channels
        };

        messages: {
            send: boolean; // send messages
            delete: boolean; // delete messages (others messages)
            mentions: boolean; // mention everyone, roles, users
            send_files: boolean; // send files
            reactions: boolean; // add reactions
        };
    };
}

export interface IRole { // This is the interface for the role in the database

    role_id: number;
    role_name: string;
    role_members: string[];
    role_color: string;
    role_position: number;
    role_server_id: number;

    created_at: string;
    updated_at: string;

    permissions?: IRolePermission;
}

export interface IRoleModel extends IRole, Document {}

const RoleSchema = new Schema({
    role_id: { type: Number, required: true, unique: true, index: true },
    role_name: { type: String, required: true },
    role_members: { type: Array, required: false, default: [] },
    role_color: { type: String, required: true, default: "#000000" },
    role_position: { type: Number, required: true, default: 0 },
    role_server_id: { type: Number, required: true },

    created_at: { type: String, required: true },
    updated_at: { type: String, required: true },

    permissions: { type: Object, required: false, default: {} } // permissions for the role
});

export default mongoose.model<IRoleModel>("Role", RoleSchema);