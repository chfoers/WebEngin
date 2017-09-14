import * as mongoose from 'mongoose';
import * as uuid from 'node-uuid';

export interface TodoInterface extends mongoose.Document {
    todoId: string;
    todoTitle: string;
    todoText: string;
};

export const TodoSchema = new mongoose.Schema({
    todoId: { type: String, default: uuid.v4 },
    todoTitle: { type: String, required: true },
    todoText: { type: String, required: false }
});

export const Todo = mongoose.model<TodoInterface>('Todo', TodoSchema);