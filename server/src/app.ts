import * as express from 'express';
import { Request, Response } from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import usersRoute from './routes/users';
import todosRoute from './routes/todos';
import contactsRoute from './routes/contacts';
import user_todosRoute from './routes/user_todos';
import config from './config';
import {AuthorisationService } from './services/authorisationService';
import * as http from 'http';
import * as WebSocket from 'ws';
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
    app.use(AuthorisationService.jwtValidationMiddleware);
    app.use('/users', usersRoute);
    app.use('/todos', todosRoute);
    app.use('/contacts', contactsRoute);
    app.use('/user_todos', user_todosRoute);

    const wss = new WebSocket.Server({ server: httpServer });
    wss.on('connection', (webSocket: WebSocket) => {
        webSocket.on('message', (message: string) => {
            wss.clients.forEach((ws: WebSocket) => {
                console.log(message);
                ws.send(message); 
                //if (ws !== webSocket) { ws.send(message); }
            })
        });
    });

    app.listen(8080, () => {
	    console.log('listening on port 8080!');
	});
};

(mongoose as any).Promise = global.Promise;
mongoose.connect(config.db.uri)
    .then(() => {
        startServer();
    })
    .catch(err => {
        console.error('App starting error:', err.stack);
        process.exit(1);
    });
