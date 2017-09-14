"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const uuid = require("node-uuid");
;
exports.TodoSchema = new mongoose.Schema({
    todoId: { type: String, default: uuid.v4 },
    todoTitle: { type: String, required: true },
    todoText: { type: String, required: false }
});
exports.Todo = mongoose.model('Todo', exports.TodoSchema);
