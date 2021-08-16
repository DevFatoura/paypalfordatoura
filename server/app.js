import express from 'express';
import path from 'path';
import cors from 'cors';

import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import invoiceRouter from './routes/invoice';
import reportRouter from './routes/report';
import paypalRouter from './routes/paypal';
import adminRouter from './routes/admin';
import paypalSubscriptionRouter from './routes/paypalSubscription'

const subdomain = require('express-subdomain');

var app = express();
app.use(logger('dev'));
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(subdomain('api', indexRouter));

app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, '../public')));
// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/invoice',invoiceRouter);
app.use('/report',reportRouter);
app.use('/paypal', paypalRouter);
app.use('/admin',adminRouter);
app.use('/subscription',paypalSubscriptionRouter);

export default app;
