const express = require('express');
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

const userRouter = express.Router();

userRouter.get('/todo.html', handlers.isAuthorizedUser);

userRouter.use(express.static('templates'));
userRouter.use(express.static('public'));

userRouter.get('/todoList', handlers.serveTodoList);
userRouter.get('/search', hasFieldsInQuery('text'), handlers.search);
userRouter.get('/getTodo/:id', hasFieldsInParams('id'), handlers.serveTodo);
userRouter.get('/logout', handlers.logout);

userRouter.post('/saveNewTodo', hasFieldsInBody('title'), handlers.saveNewTodo);
userRouter.post(
  '/addNewItem',
  hasFieldsInBody('todoId', 'item'),
  handlers.addNewItem
);

userRouter.patch(
  '/updateItemStatus',
  hasFieldsInBody('todoId', 'itemId'),
  handlers.updateItemStatus
);
userRouter.patch(
  '/editItem',
  hasFieldsInBody('todoId', 'itemId', 'item'),
  handlers.editItem
);
userRouter.patch(
  '/editTitle',
  hasFieldsInBody('todoId', 'title'),
  handlers.editTitle
);

userRouter.delete(
  '/removeTodo',
  hasFieldsInBody('todoId'),
  handlers.removeTodo
);
userRouter.delete(
  '/removeItem',
  hasFieldsInBody('todoId', 'itemId'),
  handlers.removeItem
);

module.exports = { userRouter, hasFieldsInBody };
