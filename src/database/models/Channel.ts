import mongoose, {Document, Schema} from "mongoose";

export interface IChannelPermission {
    admin: { // admin permission (can do everything)
        roles_id: number[];
        user_id: number[];
    };

    view: {
        roles_id: number[];
        user_id: number[];
    };
    member: {
        invite: {
            roles_id: number[];
            user_id: number[];
        };
        remove: {
            roles_id: number[];
            user_id: number[];
        };
    },
    message: {
        send: {
            roles_id: number[];
            user_id: number[];
        };
        mentions: {
            roles_id: number[];
            user_id: number[];
        };
        send_files: {
            roles_id: number[];
            user_id: number[];
        };
    }
}    

export interface IChannel { // This is the interface for the channel in the database
    server_id?: number;
    channel_id: number;
    owner_id?: number;
    channel_name?: string;
    channel_type: "HYBRID" | "TEXT" | "VOICE";
    channel_category: "DM" | "GROUP" | "SERVER";
    members: number[];
    members_count: number;
    updated_at: string;
    created_at: string;

    permissions?: IChannelPermission;
}

export interface IChannelModel extends IChannel, Document {}

const ChannelSchema = new Schema({
    server_id: {type: Number, required: false, index: true}, // server id if it's a server channel
    channel_id: { type: Number, required: true, unique: true, index: true },

    // if empty, it's a DM channel, if not empty and server_id is empty, it's a group channel, if not empty and server_id is not empty, it's a server channel
    owner_id: { type: Number, required: false, index: true }, 

    channel_name: { type: String, required: false },
    channel_type: { type: String, required: true }, // HYBRID (for instance DMs), TEXT, VOICE
    channel_category: { type: String, required: true }, // DM, GROUP, SERVER

    members: { type: Array, required: true, default: [] }, // map of user_id: roles_id
    members_count: { type: Number, required: true, default: 0 },
    updated_at: { type: String, required: true, default: new Date().toLocaleString() },
    created_at: { type: String, required: true, default: new Date().toLocaleString() },

    // permissions which is an object of IChannelPermission
    permissions: { type: Object, required: false, default: {} }
});

export default mongoose.model<IChannelModel>("Channel", ChannelSchema);