"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const users_1 = require("./routes/users");
function startServer() {
    const app = express();
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/users', users_1.default);
    app.listen(8080, () => {
        console.log('listening on port 8080!');
    });
}
;
startServer();
