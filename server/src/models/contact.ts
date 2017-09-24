import * as mongoose from 'mongoose';

export interface ContactInterface extends mongoose.Document{
    ownerId: string;
    contactId: string
}

export const ContactSchema = new mongoose.Schema({
    ownerId: { type: String, required: true },
    contactId: { type: String, require: true }
});

export const Contact = mongoose.model<ContactInterface>('Contact', ContactSchema);