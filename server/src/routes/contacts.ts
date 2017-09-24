import { Router, Request, Response, NextFunction } from 'express';
import { Contact, ContactInterface } from '../models/contact';
import { User, UserInterface } from '../models/user';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';

const router = Router();

router.get('/contact', AuthorisationService.authentificationMiddleware, (request: Request & JwtClaimSetHolder, response: Response) => {
    var ownerId = '';
    
    if (request.jwtClaimSet != null && request.jwtClaimSet.userId != null){ 
    ownerId= request.jwtClaimSet.userId;
}
    Contact.find({ownerId: ownerId})
            .sort({name: 'desc'})
            .exec()
            .then((contacts: ContactInterface[]) => {
                const foundContacts = contacts.map(contact => {                 
                        return {                         
                            ownerId: contact.ownerId , 
                            contactId: contact.contactId,
                            name: contact.name,
                            email: contact.email
                        };
                    });
                response.status(200).json({data: foundContacts});
            }).catch((reason: string) => {
                response.status(400).json({ message: reason });
            });
});

router.post('/contact', (request: Request & JwtClaimSetHolder, response: Response, next: NextFunction) => {

const errors = [];
var userId = '';


if (request.jwtClaimSet != null && request.jwtClaimSet.userId != null){ 
    userId= request.jwtClaimSet.userId;
}

User.findOne({ email : request.body.email })
    .exec()
    .then((contactUser: UserInterface ) => { //TODO: <[UserInterface, ContactInterface]>
        if (!contactUser) {
            return Promise.reject('User gibts nicht mit dieser Email');
        }
            else{ 
                const params= [{ ownerId : userId}, 
                {contactId: contactUser.userId}];
                return Promise.all([Promise.resolve(contactUser), Contact.findOne().and(params).exec()]);
                     }
        }).then(([contactUser, existingContact]: [UserInterface,
        ContactInterface]) => {
                                if (existingContact) {
                                    return Promise.reject('Kontakt existiert schon');
                                }
                                const contact = new Contact({
                                    ownerId: userId,
                                    contactId: contactUser.userId,
                                    name: contactUser.name,
                                    email: contactUser.email
                                });
                                return contact.save();
                        }).then ((contact: ContactInterface) => {
                                response.sendStatus(201);
                        }).catch((reason: string) => {
                                response.status(400).json({ message: reason});
                        });
    });


export default router;