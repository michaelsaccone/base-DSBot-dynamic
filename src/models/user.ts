import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    id: number;
    nickname: string;
    OTP: {
        code: string;
        expiresAt?: Date;
    };
    minecraftUUID?: string;
    discordInfos?: {
        id: string;
        username: string;
        avatar: string;
    };
}

const UserSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    nickname: { type: String },
    OTP: {
        code: { type: String, required: true },
        expiresAt: { type: Date },
    },
    minecraftUUID: { type: String },
    discordInfos: {
        id: { type: String },
        username: { type: String },
        avatar: { type: String },
        token: { type: String },
    },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
