import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import config from '../config';
import { UserInterface } from '../models/user';

export interface JwtClaimSet {
	userId: string;
	name: string;
	email: string;
}

export interface JwtClaimSetHolder {
	jwtClaimSet?: JwtClaimSet
}

export const authorisationService = {
	
	jwtValidationMiddleware: (request: Request & JwtClaimSetHolder, 
		response: Response, next: NextFunction) => {
		const token = request.cookies[config.authentification.cookieName] || '';
		jwt.verify(token, config.authentification.secret, (err: Error, claimSet: any) => {
			request.jwtClaimSet = claimSet;
			next();
		});
	},

	authenticationMiddleware: (request: Request & JwtClaimSetHolder, 
		response: Response, next: NextFunction) => {
		if (!request.jwtClaimSet) {
			response.status(401).json({message: 'You need to login.'});
		} else {
			next();
		}
	},

	isAuthenticated: (request: Request & JwtClaimSetHolder) => {
		return !!request.jwtClaimSet;
	},

	checkPassword: (password: string, user: UserInterface): Promise<boolean> => {
		return new Promise<boolean>((resolve, reject) => {
		bcrypt.compare(password, user.password, (err: Error,
		isValid: boolean) => {
				if (err){
					reject('Password is wrong.');
				} else {
					resolve(isValid);
				}
			});
		});
	},

	setHashedPassword: (user: UserInterface, password: string): Promise<UserInterface> => {
        return new Promise<UserInterface>((resolve, reject) => {
		bcrypt.hash(password+'', 8, (err: Error, hash: string) => {
				if(err) {
					reject('Could not hash password.');
				} else {
					user.password = hash;
					resolve(user);
				}
			});
		});
	},

	setTokenForUser: (response: Response, user: UserInterface) => {
		return new Promise((resolve, reject) => {
			const jwtClaimSet: JwtClaimSet = {userId: user.userId,
			name: user.name, email: user.email }
			jwt.sign(jwtClaimSet, config.authentification.secret, { algorithm: 'HS256' },
				(err: Error, token: string) => {
				if (err) {
					reject('Could not create jwtToken.')
				} else {
					response.cookie(config.authentification.cookieName, token);
					resolve();
				}
			});
		});
	},
	
	removeToken: (response: Response) => {
		response.clearCookie(config.authentification.cookieName);
	}
};