import mongoose, {Document, Schema} from "mongoose";
import { IUser } from './User';

export interface IMessage { // This is the interface for the message in the database
    message_id: string;
    user_id: string;
    channel_id: string;
    message: string;
    created_at: Date;
}

export interface IMessageModel extends IMessage, Document {}

const MessageSchema = new Schema({
    message_id: { type: String, required: true, unique: true, index: true },  
    user_id: { type: String, required: true },
    channel_id: { type: String, required: true, index: true },
    message: { type: String, required: true },
    created_at: { type: Date, required: true, default: Date.now() },
});

MessageSchema.pre<IMessageModel>('save', function (next) {
    if (!this.message_id) {
        this.message_id = this._id.toHexString().toString();
    }
    next();
});

export default mongoose.model<IMessageModel>("Message", MessageSchema);