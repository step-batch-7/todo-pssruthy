const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { userRouter, hasFieldsInBody } = require('./userRouters');

const handlers = require('./handlers');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use('/user', userRouter);

app.post('/createAccount', handlers.createAccount, (req, res) =>
  res.redirect('/')
);

app.post('/validateUsrID', hasFieldsInBody('usrId'), handlers.validateUsrID);

//-------------------------------login
app.post(
  '/login',
  hasFieldsInBody('usrName', 'password'),
  handlers.validateLoggedUser
);

module.exports = { app};
