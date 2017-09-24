"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.ContactSchema = new mongoose.Schema({
    ownerId: { type: String, required: true },
    contactId: { type: String, require: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});
exports.Contact = mongoose.model('Contact', exports.ContactSchema);
