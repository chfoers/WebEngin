"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_1 = require("../models/contact");
const user_1 = require("../models/user");
const authorisationService_1 = require("../services/authorisationService");
const validationService_1 = require("../services/validationService");
const router = express_1.Router();
router.get('/contact', authorisationService_1.AuthorisationService.authentificationMiddleware, (request, response) => {
    var ownerId = '';
    // Prüfen, ob User eingeloggt ist
    if (request.jwtClaimSet != null && request.jwtClaimSet.userId != null) {
        ownerId = request.jwtClaimSet.userId;
        // Suchen nach Kontakten
        contact_1.Contact.aggregate([
            { $unwind: "$contactId" },
            { $lookup: { from: "users", localField: "contactId", foreignField: "userId", as: "oneContact" } },
            { $match: { ownerId: ownerId } },
        ])
            .exec().then((contacts) => {
            const foundContacts = contacts.map(contact => {
                return {
                    userId: contact.oneContact[0].userId,
                    name: contact.oneContact[0].name,
                    email: contact.oneContact[0].email
                };
            });
            response.status(200).json({ data: foundContacts });
        }).catch((reason) => {
            response.status(400).json({ message: 'Kontakt existiert nicht' });
        });
    }
    else {
        response.status(400).json({ message: 'Kein User eingeloggt' });
    }
});
// Einzelnen Kontakt anzeigen
router.get('/contact/:contactId', (request, response) => {
    const errors = [];
    var ownerId = '';
    var currentContactId = request.params['contactId'];
    // Prüfen, ob User eingeloggt ist
    if (request.jwtClaimSet != null) {
        ownerId = request.jwtClaimSet.userId;
    }
    // Suchen des Kontaktes anhand der Id
    contact_1.Contact.aggregate([
        { $unwind: "$contactId" },
        { $lookup: { from: "users", localField: "contactId", foreignField: "userId", as: "oneContact" } },
        { $match: { "ownerId": ownerId, "contactId": currentContactId } }
    ])
        .exec().then((contacts) => {
        const foundContacts = contacts.map(contact => {
            return {
                userId: contact.oneContact[0].userId,
                name: contact.oneContact[0].name,
                email: contact.oneContact[0].email
            };
        });
        response.status(200).json({ data: foundContacts });
    }).catch((reason) => {
        response.status(400).json({ message: 'Kontakt existiert nicht' });
    });
});
// Einen Kontakt löschen
router.delete('/contact/:contactId', (request, response) => {
    const errors = [];
    var ownerId = '';
    var currentContactId = request.params['contactId'];
    // Prüfen, ob User eingeloggt ist
    if (request.jwtClaimSet != null) {
        ownerId = request.jwtClaimSet.userId;
        // Suchen des Kontaktes anhand der id
        contact_1.Contact.find({
            $or: [
                { ownerId: currentContactId, contactId: ownerId },
                { ownerId: ownerId, contactId: currentContactId }
            ]
        }).exec().then((contacts) => {
            contacts.forEach(contact => {
                if (!contact) {
                    return Promise.reject('Kontakt nicht vorhanden');
                }
                else {
                    // Entfernen des Kontaktes
                    return contact_1.Contact.remove(contact).exec();
                }
            });
        })
            .then(() => {
            response.status(200).json({});
        })
            .catch((reason) => {
            response.status(400).json({ message: reason });
        });
    }
    else {
        response.status(400).json({ message: 'Kein User eingeloggt' });
    }
});
//Kontakt erstellen
router.post('/contact', (request, response, next) => {
    const errors = [];
    var userId = '';
    // Prüfen, ob alle Felder befüllt sind
    if (!validationService_1.default.hasRequiredFields(request.body, ['email'], errors)) {
        response.status(400).json({ message: errors.join(' & ') });
        return;
    }
    // Prüfen, ob User eingeloggt ist
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
    })
        .then(([contactUser, existingContact]) => {
        if (existingContact) {
            return Promise.reject('Kontakt existiert schon');
        }
        if (userId == contactUser.userId) {
            return Promise.reject('Man kann sich nicht selbst als Kontakt hinzügen');
        }
        var contact2 = new contact_1.Contact({
            ownerId: contactUser.userId,
            contactId: userId,
        });
        contact2.save(); // Speichern des Kontaktes
        var contact = new contact_1.Contact({
            ownerId: userId,
            contactId: contactUser.userId,
        });
        return contact.save(); //Speichern des Kontaktes
    }).then((contact) => {
        response.sendStatus(201);
    }).catch((reason) => {
        response.status(400).json({ message: reason });
    });
});
exports.default = router;
