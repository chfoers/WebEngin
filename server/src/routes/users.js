"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorisationService_1 = require("../services/authorisationService");
const user_1 = require("../models/user");
const router = express_1.Router();
//Login
router.post('/login', (request, response) => {
    const authorisationData = { email: request.body.email, password: request.body.password };
    const errors = [];
    user_1.User.findOne({ email: authorisationData.email })
        .select('userId name email password')
        .exec()
        .then((user) => {
        if (!user) {
            return Promise.all([Promise.resolve(user), Promise.resolve(false)]);
        }
        else {
            return Promise.all([Promise.resolve(user), authorisationService_1.AuthorisationService.checkPassword(authorisationData.password, user)]);
        }
    }).then(([user, isValid]) => {
        if (isValid) {
            return authorisationService_1.AuthorisationService.setTokenForUser(response, user);
        }
        else {
            return Promise.reject('Email oder Password ungültig');
        }
    }).then(() => {
        response.sendStatus(201);
    }).catch((reason) => {
        authorisationService_1.AuthorisationService.removeToken(response);
        response.status(400).json({ message: reason });
    });
});
//Logout
router.delete('/logout', (request, response) => {
    authorisationService_1.AuthorisationService.removeToken(response);
    response.sendStatus(200);
});
// Sign Up
router.post('/registration', (request, response, next) => {
    const uD = request.body;
    var user = new user_1.User();
    user.name = uD.name;
    user.email = uD.email;
    if (uD.password !== uD.password2) {
        response.status(400).json({ message: 'Password und Password wiederholen müssen gleich sein' });
    }
    user_1.User.findOne({ email: user.email }).exec().then((existingUser) => {
        if (existingUser) {
            return Promise.reject('Email-Adresse ist bereits vergeben');
        }
        else {
            return authorisationService_1.AuthorisationService.setHashedPassword(user, uD.password);
        }
    }).then((unsavedUser) => {
        return user.save();
    }).then(() => {
        response.sendStatus(201);
    }).catch((reason) => {
        console.log(reason);
        response.status(400).json({ message: reason });
    });
});
/*
 * getMe
 * Returns the Active user object
 */
router.get('/getMe', (request, response) => {
    var user;
    if (request.jwtClaimSet != null) {
        user = request.jwtClaimSet;
    }
    response.status(200).json({ data: user });
});
exports.default = router;
