import mongoose, {Document, Schema} from "mongoose";

export interface IMessage { // This is the interface for the message in the database
    message_id: number;
    user_id: number;
    channel_id: number;
    message: string;
    created_at: string;
}

export interface IMessageModel extends IMessage, Document {}

const MessageSchema = new Schema({
    message_id: { type: Number, required: true, unique: true, index: true },
    user_id: { type: Number, required: true, index: true },
    channel_id: { type: Number, required: true, index: true },
    message: { type: String, required: true },
    created_at: { type: String, required: true, default: Date.toLocaleString() },
});

export default mongoose.model<IMessageModel>("Message", MessageSchema);