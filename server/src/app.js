"use strict";
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
const http = require("http");
const WebSocket = require("ws");
/**
import { Builder, By, until, Browser, promise } from 'selenium-webdriver';
(promise as any).USE_PROMISE_MANAGER = false;



async function LoginTest() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();
  await driver.get('http://localhost:8080/users/login');
  await driver.findElement(By.name('email')).sendKeys('max.mustermann@gmail.com');
  await driver.findElement(By.name('password')).sendKeys('supsersecret');
  await driver.findElement(By.css('.btn.btn-default')).click();
  await driver.wait(until.elementLocated(By.className('alert')), 1000);

  await driver.quit();
}

LoginTest();
*/
function startServer() {
    const app = express();
    app.use(express.static('public'));
    const httpServer = http.createServer(app);
    httpServer.listen(8081);
    app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(authorisationService_1.AuthorisationService.jwtValidationMiddleware);
    app.use('/users', users_1.default);
    app.use('/todos', todos_1.default);
    app.use('/contacts', contacts_1.default);
    app.use('/user_todos', user_todos_1.default);
    const wss = new WebSocket.Server({ server: httpServer });
    wss.on('connection', (webSocket) => {
        webSocket.on('message', (message) => {
            wss.clients.forEach((ws) => {
                console.log(message);
                ws.send(message);
                //if (ws !== webSocket) { ws.send(message); }
            });
        });
    });
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
