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
    manage: {
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
    channel_id: string;
    channel_name: string;
    channel_category: "AUDIO" | "TEXT" | "HYBRID";
    members: string[];
    updated_at: Date;
    created_at: Date;

    server_id?: string;
    permissions?: IChannelPermission;
}

export interface IChannelModel extends IChannel, Document {}

const ChannelSchema = new Schema({
    channel_id: { type: String, required: true, unique: true, index: true },

    channel_name: { type: String, required: true },
    channel_category: { type: String, required: true }, // DM, SERVER

    members: { type: Array, required: true, default: {} }, // map of user_id: roles_id
    updated_at: { type: Date, required: true, default: Date.now() },
    created_at: { type: Date, required: true, default: Date.now() },

    server_id: {type: String, required: false, index: true}, // server id if it's a server channel
    permissions: { type: Object, required: false, default: {
        admin: { // admin permission (can do everything)
            roles_id: [],
            user_id: [],
        },
    
        view: {
            roles_id: [],
            user_id: [],
        },
        manage: {
            invite: {
                roles_id: [],
                user_id: [],
            },
            remove: {
                roles_id: [],
                user_id: [],
            },
        },
        message: {
            send: {
                roles_id: [],
                user_id: [],
            },
            mentions: {
                roles_id: [],
                user_id: [],
            },
            send_files: {
                roles_id: [],
                user_id: [],
            },
        }
    }} // permissions for the channel
});

ChannelSchema.pre<IChannelModel>('save', function (next) {
    if (!this.channel_id) {
        this.channel_id = this._id.toHexString().toString();
    }
    next();
});

export default mongoose.model<IChannelModel>("Channel", ChannelSchema);