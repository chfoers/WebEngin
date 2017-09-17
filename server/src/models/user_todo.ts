import * as mongoose from 'mongoose';
import * as uuid from 'node-uuid';

export interface User_TodoInterface extends mongoose.Document {
    userId: string;
    todoId: string;
    
};

export const User_TodoSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    todoId: { type: String, required: true },
});

export const User_Todo = mongoose.model<User_TodoInterface>('User_Todo', User_TodoSchema);