import * as mongoose from 'mongoose';

export interface ContactInterface extends mongoose.Document{
    ownerId: string;
    contactId: string; // userId...
    name: string;
}

export const ContactSchema = new mongoose.Schema({
    ownerId: { type: String, required:true },
    contactId: { type: String, require: true},
    name: { type: String, required: true }
});

export const Contact = mongoose.model<ContactInterface>('Contact', ContactSchema);