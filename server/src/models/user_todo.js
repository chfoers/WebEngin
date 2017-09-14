"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
;
exports.User_TodoSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    todoId: { type: String, required: true },
});
exports.User_Todo = mongoose.model('Todo', exports.User_TodoSchema);
