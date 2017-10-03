import { Router, Request, Response, NextFunction } from 'express';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';
import { User, UserInterface } from '../models/user';

const router = Router();

//Login
router.post('/login', (request: Request, response: Response) => {
const authorisationData = { email: request.body.email, password: request.body.password };
const errors = [];


	User.findOne({email: authorisationData.email})
	.select('userId name email password')
	.exec()
	.then((user: UserInterface) => {
		if (!user) {
		return Promise.all([Promise.resolve(user), Promise.resolve(false)]);
            } else {
                return Promise.all([Promise.resolve(user), AuthorisationService.checkPassword(authorisationData.password, user)]);
            }
	}).then(([user, isValid]: [UserInterface, boolean]) => {
            if (isValid) {
                return AuthorisationService.setTokenForUser(response, user);
            } else {
                return Promise.reject('Email oder Password ungültig');
            }
	}).then(() => {
            response.sendStatus(201);
        }).catch((reason) => {
            AuthorisationService.removeToken(response);
            response.status(400).json({message: reason});
        });
});

//Logout
router.delete('/logout', (request: Request, response: Response) => {
    AuthorisationService.removeToken(response);
    response.sendStatus(200);
});

// Sign Up
router.post('/registration', (request: Request, response: Response, next: NextFunction) => {
    const uD = request.body;
    var user = new User();
    user.name = uD.name; 
    user.email = uD.email;
    

    if (uD.password !== uD.password2) {
        response.status(400).json({message: 'Password und Password wiederholen müssen gleich sein'});
    } else {
        User.findOne({ email: user.email }).exec().then((existingUser: UserInterface) => {
            if (existingUser) {
                return Promise.reject('Email-Adresse ist bereits vergeben');
            } else {
                return AuthorisationService.setHashedPassword(user, uD.password);
            }
        }).then((unsavedUser: UserInterface) => {
            return user.save();
        }).then(() => {
            response.sendStatus(201);
        }).catch((reason: string) => {
            response.status(400).json({message: reason});
        });
    } 
});

/*
 * getMe
 * Returns the Active user object
 */
router.get('/getMe', (request: Request & JwtClaimSetHolder, response: Response) => {
    var user;

    if (request.jwtClaimSet != null){
        user = request.jwtClaimSet;
    }

    response.status(200).json({ data: user });
});


export default router;