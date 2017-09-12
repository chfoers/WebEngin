import * as express from 'express';
import { Request, Response } from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import usersRoute from './routes/users';
import config from './config';
import {AuthorisationService } from './services/authorisationService';

function startServer() {
const app = express();

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(AuthorisationService.jwtValidationMiddleware);
app.use('/users', usersRoute);

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