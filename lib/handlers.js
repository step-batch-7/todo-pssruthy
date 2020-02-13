const querystring = require('querystring');

const { TodoList } = require('./todoList');
const { storeTodoList, loadTodo } = require('./fileOperations');

const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = require('./statusCodes');

const todoList = TodoList.load(loadTodo());

const saveNewTodo = function(req, res) {
  const todo = todoList.createAndGiveTodo(req.body.title);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todo));
};

const serveTodoList = function(req, res) {
  res.statusCode = STATUS_CODE.ok;
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(todoList.toJSON());
};

const updateItemStatus = function(req, res) {
  const { itemId, todoId } = req.body;
  todoList.toggleStatus(todoId, itemId);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.end();
};

const removeTodo = function(req, res) {
  todoList.deleteTodo(req.body.todoId);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.end();
};

const removeItem = function(req, res) {
  const { itemId, todoId } = req.body;
  todoList.removeItem(todoId, itemId);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.end();
};

const serveTodo = function(req, res) {
  const [, body] = req.url.split('?');
  const { id } = querystring.parse(body);
  const todo = todoList.findTodo(id);
  res.statusCode = STATUS_CODE.ok;
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todo));
};

const addNewItem = function(req, res) {
  const { todoId, item } = req.body;
  const todo = todoList.addNewItem(todoId, item);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todo));
};

const editItem = function(req, res) {
  const { todoId, itemId, item } = req.body;
  const todo = todoList.editItem(todoId, itemId, item);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todo));
};

const editTitle = function(req, res) {
  const { todoId, title } = req.body;
  const todo = todoList.editTitle(todoId, title);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todo));
};

const search = function(req, res) {
  const [, body] = req.url.split('?');
  const { text } = querystring.parse(body);
  res.statusCode = 200;
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList.search(text)));
};

module.exports = {
  serveTodoList,
  search,
  serveTodo,
  saveNewTodo,
  addNewItem,
  updateItemStatus,
  editItem,
  editTitle,
  removeTodo,
  removeItem
};
