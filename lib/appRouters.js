const express = require('express');
const app = express();

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/todoList', handlers.serveTodoList);
app.get('/search', hasFields('query', 'text'), handlers.search);
app.get('/getTodo/:id', hasFields('params', 'id'), handlers.serveTodo);

app.post('/saveNewTodo', hasFields('body', 'title'), handlers.saveNewTodo);
app.post(
  '/addNewItem',
  hasFields('body', 'todoId', 'item'),
  handlers.addNewItem
);

app.patch(
  '/updateItemStatus',
  hasFields('body', 'todoId', 'itemId'),
  handlers.updateItemStatus
);
app.patch(
  '/editItem',
  hasFields('body', 'todoId', 'itemId', 'item'),
  handlers.editItem
);
app.patch(
  '/editTitle',
  hasFields('body', 'todoId', 'title'),
  handlers.editTitle
);

app.delete('/removeTodo', hasFields('body', 'todoId'), handlers.removeTodo);
app.delete(
  '/removeItem',
  hasFields('body', 'todoId', 'itemId'),
  handlers.removeItem
);

module.exports = { app };
