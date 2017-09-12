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
                return Promise.reject('Invalid email or password.');
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
    const userData = request.body;
    const user = new User(userData);
    if (userData['password'] !== userData['password2']) {
        response.status(407).json({message: 'password does not match password confirmation!'});
        return;
    }

    User.findOne({ email: user.email }).exec().then((existingUser: UserInterface) => {
        if (existingUser) {
            return Promise.reject('A user with this email already exists');
        } else {
            return AuthorisationService.setHashedPassword(user, user.password);
        }
    }).then((unsavedUser: UserInterface) => {
        return user.save();
    }).then(() => {
        response.sendStatus(201);
    }).catch((reason: string) => {
        response.status(400).json({message: reason});
    });
});
export default router;