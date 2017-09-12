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
            return Promise.all([Promise.resolve(user), authorisationService_1.authorisationService.checkPassword(authorisationData.password, user)]);
        }
    }).then(([user, isValid]) => {
        if (isValid) {
            return authorisationService_1.authorisationService.setTokenForUser(response, user);
        }
        else {
            return Promise.reject('Invalid email or password.');
        }
    }).then(() => {
        response.sendStatus(201);
    }).catch((reason) => {
        authorisationService_1.authorisationService.removeToken(response);
        response.status(400).json({ message: reason });
    });
});
exports.default = router;
