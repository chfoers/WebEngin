import { Router, Request, Response, NextFunction } from 'express';
import { authorisationService, JwtClaimSetHolder } from '../services/authorisationService';
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
                return Promise.all([Promise.resolve(user), authorisationService.checkPassword(authorisationData.password, user)]);
            }
	}).then(([user, isValid]: [UserInterface, boolean]) => {
            if (isValid) {
                return authorisationService.setTokenForUser(response, user);
            } else {
                return Promise.reject('Invalid email or password.');
            }
	}).then(() => {
            response.sendStatus(201);
        }).catch((reason) => {
            authorisationService.removeToken(response);
            response.status(400).json({message: reason});
        });
});
export default router;