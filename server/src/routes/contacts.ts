import { Router, Request, Response, NextFunction } from 'express';
import { Contact, ContactInterface } from '../models/contact';
import { User, UserInterface } from '../models/user';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';

const router = Router();


router.post('/contact', (request: Request & JwtClaimSetHolder, response: Response, next: NextFunction) => {

const errors = [];
var userId = '';


if (request.jwtClaimSet != null && request.jwtClaimSet.userId != null){ 
    userId= request.jwtClaimSet.userId;
}

User.findOne({ email : request.body.email })
    .exec()
    .then<[UserInterface, ContactInterface]>((contactUser: UserInterface ) => {
        if (!contactUser) {
            return Promise.reject('User gibts nicht mit dieser Email');
        }
            else{ 
                const params= [{ ownerId : userId}, 
                {contactId: contactUser.userId}];
                return Promise.all([Promise.resolve(contactUser), Contact.findOne().and(params).exec()]);
                     }
        }).then<ContactInterface>(([contactUser, existingContact]: [UserInterface,
        ContactInterface]) => {
                                if (existingContact) {
                                    return Promise.reject('Kontakt existiert schon');
                                }
                                const contact = new Contact({
                                    ownerId: userId,
                                    contactId: contactUser.userId,
                                    name: contactUser.name
                                });
                                return contact.save();
                        }).then ((contact: ContactInterface) => {
                                response.sendStatus(201);
                        }).catch((reason: string) => {
                                response.status(400).json({ message: reason});
                        });
    });


export default router;