const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const handlers = require('./handlers');

const hasFields = function(involvedKey, ...fields) {
  return (req, res, next) => {
    if (fields.every(field => field in req[involvedKey])) {
      return next();
    }
    res.statusCode = 400;
    res.end('bad request');
  };
};

const hasFieldsInBody = hasFields.bind(null, 'body');
const hasFieldsInQuery = hasFields.bind(null, 'query');
const hasFieldsInParams = hasFields.bind(null, 'params');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.get('/todoList', handlers.serveTodoList);
app.get('/search', hasFieldsInQuery('text'), handlers.search);
app.get('/getTodo/:id', hasFieldsInParams('id'), handlers.serveTodo);
app.get('/logout', handlers.logout);

app.post('/saveNewTodo', hasFieldsInBody('title'), handlers.saveNewTodo);
app.post('/addNewItem', hasFieldsInBody('todoId', 'item'), handlers.addNewItem);
app.post('/createAccount', handlers.createAccount, (req, res) =>
  res.redirect('/')
);

app.post('/validateUsrID', hasFieldsInBody('usrId'), handlers.validateUsrID);

app.patch(
  '/updateItemStatus',
  hasFieldsInBody('todoId', 'itemId'),
  handlers.updateItemStatus
);
app.patch(
  '/editItem',
  hasFieldsInBody('todoId', 'itemId', 'item'),
  handlers.editItem
);
app.patch('/editTitle', hasFieldsInBody('todoId', 'title'), handlers.editTitle);

app.delete('/removeTodo', hasFieldsInBody('todoId'), handlers.removeTodo);
app.delete(
  '/removeItem',
  hasFieldsInBody('todoId', 'itemId'),
  handlers.removeItem
);

//-------------------------------login
app.post(
  '/login',
  hasFieldsInBody('usrName', 'password'),
  handlers.validateLoggedUser
);

module.exports = { app };
