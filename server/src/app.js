"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const users_1 = require("./routes/users");
const todos_1 = require("./routes/todos");
const contacts_1 = require("./routes/contacts");
const user_todos_1 = require("./routes/user_todos");
const config_1 = require("./config");
const authorisationService_1 = require("./services/authorisationService");
const selenium_webdriver_1 = require("selenium-webdriver");
selenium_webdriver_1.promise.USE_PROMISE_MANAGER = false;
function LoginTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const driver = yield new selenium_webdriver_1.Builder().forBrowser(selenium_webdriver_1.Browser.CHROME).build();
        yield driver.get('http://localhost:8080/users/login');
        yield driver.findElement(selenium_webdriver_1.By.name('email')).sendKeys('max.mustermann@gmail.com');
        yield driver.findElement(selenium_webdriver_1.By.name('password')).sendKeys('supsersecret');
        yield driver.findElement(selenium_webdriver_1.By.css('.btn.btn-default')).click();
        yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.className('alert')), 1000);
        yield driver.quit();
    });
}
LoginTest();
function startServer() {
    const app = express();
    app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(authorisationService_1.AuthorisationService.jwtValidationMiddleware);
    app.use('/users', users_1.default);
    app.use('/todos', todos_1.default);
    app.use('/contacts', contacts_1.default);
    app.use('/user_todos', user_todos_1.default);
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
