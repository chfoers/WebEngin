"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config_1 = require("../config");
exports.authorisationService = {
    jwtValidationMiddleware: (request, response, next) => {
        const token = request.cookies[config_1.default.authentification.cookieName] || '';
        jwt.verify(token, config_1.default.authentification.secret, (err, claimSet) => {
            request.jwtClaimSet = claimSet;
            next();
        });
    },
    authenticationMiddleware: (request, response, next) => {
        if (!request.jwtClaimSet) {
            response.status(401).json({ message: 'You need to login.' });
        }
        else {
            next();
        }
    },
    isAuthenticated: (request) => {
        return !!request.jwtClaimSet;
    },
    checkPassword: (password, user) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, isValid) => {
                if (err) {
                    reject('Password is wrong.');
                }
                else {
                    resolve(isValid);
                }
            });
        });
    },
    setHashedPassword: (user, password) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password + '', 8, (err, hash) => {
                if (err) {
                    reject('Could not hash password.');
                }
                else {
                    user.password = hash;
                    resolve(user);
                }
            });
        });
    },
    setTokenForUser: (response, user) => {
        return new Promise((resolve, reject) => {
            const jwtClaimSet = { userId: user.userId,
                name: user.name, email: user.email };
            jwt.sign(jwtClaimSet, config_1.default.authentification.secret, { algorithm: 'HS256' }, (err, token) => {
                if (err) {
                    reject('Could not create jwtToken.');
                }
                else {
                    response.cookie(config_1.default.authentification.cookieName, token);
                    resolve();
                }
            });
        });
    },
    removeToken: (response) => {
        response.clearCookie(config_1.default.authentification.cookieName);
    }
};
