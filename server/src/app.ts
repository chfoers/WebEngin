import * as express from 'express';
import { Request, Response } from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import usersRoute from './routes/users';

function startServer() {
const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', usersRoute);

app.listen(8080, () => {
	console.log('listening on port 8080!');
	});
};

startServer();