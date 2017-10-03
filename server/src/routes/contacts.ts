import { Router, Request, Response, NextFunction } from 'express';
import { Contact, ContactInterface } from '../models/contact';
import { User, UserInterface } from '../models/user';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';

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
    
    if (request.jwtClaimSet != null && request.jwtClaimSet.userId != null){ 
    ownerId= request.jwtClaimSet.userId;
    }

    Contact.aggregate([
        {$unwind: "$contactId"}, 
        {$lookup: {from: "users", localField: "contactId", foreignField: "userId", as: "oneContact"}}, 
        {$match: {ownerId : ownerId}},
    ])
    .exec().then((contacts:  QueryResultType[]) => {
                    const foundContacts = contacts.map(contact => {                 
                        return {                         
                            userId: contact.oneContact[0].userId,
                            name: contact.oneContact[0].name,
                            email: contact.oneContact[0].email
                        };
                    });
                    response.status(200).json({ data: foundContacts }); 
                }).catch((reason: string) => {
                    response.status(400).json({ message: reason });
                }); 
});

// Einzelnen Kontakt anzeigen
router.get('/contact/:contactId', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var ownerId: string = '';
    var currentContactId = request.params['contactId'];

    if (request.jwtClaimSet != null){
        ownerId = request.jwtClaimSet.userId;
    }   
    Contact.aggregate([
        {$unwind: "$contactId"}, 
        {$lookup: {from: "users", localField: "contactId", foreignField: "userId", as: "oneContact"}}, 
        {$match: {"ownerId" : ownerId, "contactId": currentContactId}}
    ])
    .exec().then((contacts:  QueryResultType[]) => {
            const foundContacts = contacts.map(contact => {                 
                return {                         
                    userId: contact.oneContact[0].userId,
                    name: contact.oneContact[0].name,
                    email: contact.oneContact[0].email
                };
            });
            response.status(200).json({ data: foundContacts }); 
    }).catch((reason: string) => {
            response.status(400).json({ message: reason });
    }); 
});

// Einen Kontakt löschen
router.delete('/contact/:contactId', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var ownerId: string = '';
    var currentContactId = request.params['contactId'];

    if (request.jwtClaimSet != null){
        ownerId = request.jwtClaimSet.userId;
    }  
    Contact.find({$or:[
                    {ownerId: currentContactId, contactId: ownerId},
                    {ownerId: ownerId, contactId: currentContactId}
                    ]}).exec().then((contacts: ContactInterface[]) => {
        contacts.forEach(contact => { 
            if (!contact) {
                return Promise.reject('Contact not found.');
            } else {
                return Contact.remove(contact).exec();
            }
        });
    })
    .then(() => {
        response.status(200).json({ }); 
    })
    .catch((reason: string) => {
        response.status(400).json({ message: reason });
    }); 
});

//Kontakt erstellen
router.post('/contact', (request: Request & JwtClaimSetHolder, response: Response, next: NextFunction) => {

const errors = [];
var userId = '';


if (request.jwtClaimSet != null && request.jwtClaimSet.userId != null){ 
    userId= request.jwtClaimSet.userId;
}

User.findOne({ email : request.body.email })
    .exec()
    .then((contactUser: UserInterface ) => { 
        if (!contactUser) {
            return Promise.reject('User gibts nicht mit dieser Email');
        }
            else{ 
                const params= [{ ownerId : userId}, 
                {contactId: contactUser.userId}];
                return Promise.all([Promise.resolve(contactUser), Contact.findOne().and(params).exec()]);
                     }
        })
    .then(([contactUser, existingContact]: [UserInterface,ContactInterface]) => {
                                if (existingContact) {
                                    return Promise.reject('Kontakt existiert schon');
                                }
                                if (userId == contactUser.userId){
                                    return Promise.reject('Man kann sich nicht selbst als Kontakt hinzügen')
                                } 
                                
                                var contact2 = new Contact({
                                    ownerId: contactUser.userId,
                                    contactId: userId,
                                });
                                contact2.save();
                                
                                var contact = new Contact({
                                    ownerId: userId,
                                    contactId: contactUser.userId,
                                });
                                return contact.save();
                        }).then ((contact: ContactInterface) => {
                                response.sendStatus(201);
                        }).catch((reason: string) => {
                                response.status(400).json({ message: reason});
                        });
    });


export default router;