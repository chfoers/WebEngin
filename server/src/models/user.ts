import * as mongoose from 'mongoose';
import * as uuid from 'node-uuid';

export interface UserInterface extends mongoose.Document {
    userId: string;
    name: string;
    email: string;
    password: string;
};

export const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, select: false },
    userId: { type: String, default: uuid.v4 }
});

export const User = mongoose.model<UserInterface>('User', UserSchema);