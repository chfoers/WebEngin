"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const users_1 = require("./routes/users");
const config_1 = require("./config");
const authorisationService_1 = require("./services/authorisationService");
function startServer() {
    const app = express();
    app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(authorisationService_1.AuthorisationService.jwtValidationMiddleware);
    app.use('/users', users_1.default);
    app.listen(8080, () => {
        console.log('listening on port 8080!');
    });
}
;
mongoose.Promise = global.Promise;
mongoose.connect(config_1.default.db.uri)
    .then(() => {
    startServer();
})
    .catch(err => {
    console.error('App starting error:', err.stack);
    process.exit(1);
});
