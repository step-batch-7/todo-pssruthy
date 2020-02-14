const { TodoList } = require('./todoList');
const { storeTodoList, loadTodo } = require('./fileOperations');

const STATUS_CODE = require('./statusCodes');

const todoList = TodoList.load(loadTodo());

const saveNewTodo = function(req, res) {
  const todo = todoList.createAndGiveTodo(req.body.title);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.json(todo);
};

const serveTodoList = function(req, res) {
  res.statusCode = STATUS_CODE.ok;
  res.json(todoList.todoList);
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
  const todo = todoList.findTodo(req.params.id);
  res.statusCode = STATUS_CODE.ok;
  res.json(todo);
};

const addNewItem = function(req, res) {
  const { todoId, item } = req.body;
  const todo = todoList.addNewItem(todoId, item);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.json(todo);
};

const editItem = function(req, res) {
  const { todoId, itemId, item } = req.body;
  const todo = todoList.editItem(todoId, itemId, item);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.json(todo);
};

const editTitle = function(req, res) {
  const { todoId, title } = req.body;
  const todo = todoList.editTitle(todoId, title);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.json(todo);
};

const search = function(req, res) {
  res.statusCode = 200;
  res.json(todoList.search(req.params.text));
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
