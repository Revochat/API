import mongoose, {Document, Schema} from "mongoose";

export interface IInvite {
    server_id: string;
    invite_id: string;
    created_at: string;
    expires_at: string;
    uses: number;
    inviter_id: string;
}

export interface IInviteModel extends IInvite {}

const InviteSchema = new Schema({
    server_id: { type: String, required: true, index: true },
    invite_id: { type: String, required: true, unique: true, index: true },
    created_at: { type: String, required: true, default: Date.toLocaleString() },
    expires_at: { type: String, required: true, default: Date.toLocaleString() },
    uses: { type: Number, required: true },
    inviter_id: { type: String, required: true, index: true }
});

export default mongoose.model<IInviteModel>("Invite", InviteSchema);