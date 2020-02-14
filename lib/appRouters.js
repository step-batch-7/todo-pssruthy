const express = require('express');
const app = express();

const handlers = require('./handlers');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/todoList', handlers.serveTodoList);
app.get('/search/:text', handlers.search);
app.get('/getTodo/:id', handlers.serveTodo);

app.post('/saveNewTodo', handlers.saveNewTodo);
app.post('/addNewItem', handlers.addNewItem);

app.patch('/updateItemStatus', handlers.updateItemStatus);
app.patch('/editItem', handlers.editItem);
app.patch('/editTitle', handlers.editTitle);

app.delete('/removeTodo', handlers.removeTodo);
app.delete('/removeItem', handlers.removeItem);

module.exports = { app };
