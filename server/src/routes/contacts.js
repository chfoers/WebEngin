"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_1 = require("../models/contact");
const user_1 = require("../models/user");
const authorisationService_1 = require("../services/authorisationService");
const router = express_1.Router();
router.get('/contact', authorisationService_1.AuthorisationService.authentificationMiddleware, (request, response) => {
    var ownerId = '';
    if (request.jwtClaimSet != null && request.jwtClaimSet.userId != null) {
        ownerId = request.jwtClaimSet.userId;
    }
    contact_1.Contact.find({ ownerId: ownerId })
        .sort({ name: 'desc' })
        .exec()
        .then((contacts) => {
        console.log(contacts);
        const foundContacts = contacts.map(contact => {
            return {
                ownerId: contact.ownerId,
                contactId: contact.contactId,
                name: contact.name,
                email: contact.email
            };
        });
        response.json({ data: foundContacts });
    });
});
router.post('/contact', (request, response, next) => {
    const errors = [];
    var userId = '';
    if (request.jwtClaimSet != null && request.jwtClaimSet.userId != null) {
        userId = request.jwtClaimSet.userId;
    }
    user_1.User.findOne({ email: request.body.email })
        .exec()
        .then((contactUser) => {
        if (!contactUser) {
            return Promise.reject('User gibts nicht mit dieser Email');
        }
        else {
            const params = [{ ownerId: userId },
                { contactId: contactUser.userId }];
            return Promise.all([Promise.resolve(contactUser), contact_1.Contact.findOne().and(params).exec()]);
        }
    }).then(([contactUser, existingContact]) => {
        if (existingContact) {
            return Promise.reject('Kontakt existiert schon');
        }
        const contact = new contact_1.Contact({
            ownerId: userId,
            contactId: contactUser.userId,
            name: contactUser.name,
            email: contactUser.email
        });
        return contact.save();
    }).then((contact) => {
        response.sendStatus(201);
    }).catch((reason) => {
        response.status(400).json({ message: reason });
    });
});
exports.default = router;
