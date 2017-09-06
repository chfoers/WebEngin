"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const uuid = require("node-uuid");
;
exports.UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, select: false },
    userId: { type: String, default: uuid.v4 }
});
exports.User = mongoose.model('User', exports.UserSchema);
