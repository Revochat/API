import mongoose, {Document, Schema} from "mongoose";
import { IUser } from './User';

export interface IMessage { // This is the interface for the message in the database
    message_id: string;
    user_id: string;
    channel_id: string;
    message: string;
}

export interface IMessageModel extends IMessage, Document {}

const MessageSchema = new Schema({
    message_id: { type: String, unique: true, index: true, default: "" },  
    user_id: { type: String, required: true },
    channel_id: { type: String, required: true, index: true },
    message: { type: String, required: true },
},
    {timestamps: true}
);

MessageSchema.pre<IMessageModel>('save', function (next) {
    if (!this.message_id) {
        this.message_id = this._id.toHexString().toString();
    }
    next();
});

export default mongoose.model<IMessageModel>("Message", MessageSchema);