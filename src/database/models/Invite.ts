import mongoose, {Document, Schema} from "mongoose";

export interface IInvite {
    server_id: string;
    invite_id: string;
    expires_at: Date;
    uses: number;
    inviter_id: string;
}

export interface IInviteModel extends IInvite, Document {}

const InviteSchema = new Schema({
    server_id: { type: String, required: true, index: true },
    invite_id: { type: String, required: true, unique: true, index: true },
    expires_at: { type: Date, required: true, default: Date.now() },
    uses: { type: Number, required: true },
    inviter_id: { type: String, required: true, index: true }
}, 
{timestamps: true}
);


InviteSchema.pre<IInviteModel>('save', function (next) {
    if (!this.invite_id) {
        this.invite_id = this._id.toHexString().toString();
    }
    next();
});

export default mongoose.model<IInviteModel>("Invite", InviteSchema);