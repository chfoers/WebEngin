"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_1 = require("../models/contact");
const user_1 = require("../models/user");
const router = express_1.Router();
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
            return contact_1.Contact.findOne().and(params).exec();
            //return Promise.all([Promise.resolve(contactUser), Contact.findOne().and(params).exec()]);
        }
    }).then(([contactUser, existingContact]) => {
        if (existingContact) {
            return Promise.reject('Kontakt existiert schon');
        }
        const contact = new contact_1.Contact({
            ownerId: userId,
            contactId: contactUser.userId,
            name: contactUser.name
        });
        return contact.save();
    }).then((contact) => {
        response.sendStatus(201);
    }).catch((reason) => {
        response.status(400).json({ message: reason });
    });
});
exports.default = router;
