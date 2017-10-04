import { Router, Request, Response, NextFunction } from 'express';
import { Contact, ContactInterface } from '../models/contact';
import { User, UserInterface } from '../models/user';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';
import validationService from '../services/validationService';

const router = Router();

interface QueryResultType {
    oneContact: [{
        userId: string;
        name: string;
        email: string;
    }]
}

router.get('/contact', AuthorisationService.authentificationMiddleware, (request: Request & JwtClaimSetHolder, response: Response) => {
    var ownerId = '';

    // Prüfen, ob User eingeloggt ist
    if (request.jwtClaimSet != null && request.jwtClaimSet.userId != null) {
        ownerId = request.jwtClaimSet.userId;

        // Suchen nach Kontakten
        Contact.aggregate([
            { $unwind: "$contactId" },
            { $lookup: { from: "users", localField: "contactId", foreignField: "userId", as: "oneContact" } },
            { $match: { ownerId: ownerId } },
        ])
            .exec().then((contacts: QueryResultType[]) => {
                const foundContacts = contacts.map(contact => {
                    return {
                        userId: contact.oneContact[0].userId,
                        name: contact.oneContact[0].name,
                        email: contact.oneContact[0].email
                    };
                });
                response.status(200).json({ data: foundContacts });
            }).catch((reason: string) => {
                response.status(400).json({ message: 'Kontakt existiert nicht' });
            });
    } else {
        response.status(400).json({ message: 'Kein User eingeloggt' });
    }
});

// Einzelnen Kontakt anzeigen
router.get('/contact/:contactId', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var ownerId: string = '';
    var currentContactId = request.params['contactId'];

    // Prüfen, ob User eingeloggt ist
    if (request.jwtClaimSet != null) {
        ownerId = request.jwtClaimSet.userId;
    }

    // Suchen des Kontaktes anhand der Id
    Contact.aggregate([
        { $unwind: "$contactId" },
        { $lookup: { from: "users", localField: "contactId", foreignField: "userId", as: "oneContact" } },
        { $match: { "ownerId": ownerId, "contactId": currentContactId } }
    ])
        .exec().then((contacts: QueryResultType[]) => {
            const foundContacts = contacts.map(contact => {
                return {
                    userId: contact.oneContact[0].userId,
                    name: contact.oneContact[0].name,
                    email: contact.oneContact[0].email
                };
            });
            response.status(200).json({ data: foundContacts });
        }).catch((reason: string) => {
            response.status(400).json({ message: 'Kontakt existiert nicht' });
        });
});

// Einen Kontakt löschen
router.delete('/contact/:contactId', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var ownerId: string = '';
    var currentContactId = request.params['contactId'];

    // Prüfen, ob User eingeloggt ist
    if (request.jwtClaimSet != null) {
        ownerId = request.jwtClaimSet.userId;
        // Suchen des Kontaktes anhand der id
        Contact.find({
            $or: [
                { ownerId: currentContactId, contactId: ownerId },
                { ownerId: ownerId, contactId: currentContactId }
            ]
        }).exec().then((contacts: ContactInterface[]) => {
            contacts.forEach(contact => {
                if (!contact) {
                    return Promise.reject('Kontakt nicht vorhanden');
                } else {
                    // Entfernen des Kontaktes
                    return Contact.remove(contact).exec();
                }
            });
        })
            .then(() => {
                response.status(200).json({});
            })
            .catch((reason: string) => {
                response.status(400).json({ message: reason });
            });
    } else {
        response.status(400).json({ message: 'Kein User eingeloggt' });
    }
});

//Kontakt erstellen
router.post('/contact', (request: Request & JwtClaimSetHolder, response: Response, next: NextFunction) => {

    const errors: string[] = [];
    var userId = '';

    // Prüfen, ob alle Felder befüllt sind
    if (!validationService.hasRequiredFields(request.body, ['email'], errors)) {
        response.status(400).json({ message: errors.join(' & ') });
        return;
    }

    // Prüfen, ob User eingeloggt ist
    if (request.jwtClaimSet != null && request.jwtClaimSet.userId != null) {
        userId = request.jwtClaimSet.userId;
    }

    User.findOne({ email: request.body.email })
        .exec()
        .then((contactUser: UserInterface) => {
            if (!contactUser) {
                return Promise.reject('User mit dieser Email gibt es nicht');
            }
            else {
                const params = [{ ownerId: userId },
                { contactId: contactUser.userId }];
                return Promise.all([Promise.resolve(contactUser), Contact.findOne().and(params).exec()]);
            }
        })
        .then(([contactUser, existingContact]: [UserInterface, ContactInterface]) => {
            if (existingContact) { // Prüfen, ob Kontakt schon existiert
                return Promise.reject('Kontakt existiert schon');
            }
            if (userId == contactUser.userId) {
                return Promise.reject('Man kann sich nicht selbst als Kontakt hinzufügen')
            }

            var contact2 = new Contact({
                ownerId: contactUser.userId,
                contactId: userId,
            });
            contact2.save(); // Speichern des Kontaktes

            var contact = new Contact({
                ownerId: userId,
                contactId: contactUser.userId,
            });
            return contact.save(); //Speichern des Kontaktes
        }).then((contact: ContactInterface) => {
            response.sendStatus(201);
        }).catch((reason: string) => {
            response.status(400).json({ message: reason });
        });
});

export default router;