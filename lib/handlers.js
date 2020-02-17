const config = require('./../config');
// const { TodoList } = require('./todoList');
const { Users } = require('./users');
const { UserTodo } = require('./userTodo');

const { storeData, loadData, loadUser } = require('./fileOperations');

const storeTodoList = storeData.bind(null, config.STORAGE_FILE);

const users = Users.load(loadUser(config.USERS_DETAIL));
// const todoList = TodoList.load(loadData(config.STORAGE_FILE));
const userTodo = UserTodo.load(loadData(config.STORAGE_FILE));
const sessionIds = {};

const getTodo = function(req) {
  const { sessionId } = req.cookies;
  return sessionIds[sessionId].todo;
};

const saveNewTodo = function(req, res) {
  const todoList = getTodo(req);
  const todo = todoList.createAndGiveTodo(req.body.title);
  storeTodoList(userTodo.toJSON());
  res.json(todo);
};

const serveTodoList = function(req, res) {
  const todoList = getTodo(req);
  res.json(todoList.todoList);
};

const updateItemStatus = function(req, res) {
  const todoList = getTodo(req);
  const { itemId, todoId } = req.body;
  todoList.toggleStatus(todoId, itemId);
  storeTodoList(userTodo.toJSON());
  res.end();
};

const removeTodo = function(req, res) {
  const todoList = getTodo(req);
  todoList.deleteTodo(req.body.todoId);
  storeTodoList(userTodo.toJSON());
  res.end();
};

const removeItem = function(req, res) {
  const todoList = getTodo(req);
  const { itemId, todoId } = req.body;
  todoList.removeItem(todoId, itemId);
  storeTodoList(userTodo.toJSON());
  res.end();
};

const serveTodo = function(req, res) {
  const todoList = getTodo(req);
  const todo = todoList.findTodo(req.params.id);
  res.json(todo);
};

const addNewItem = function(req, res) {
  const todoList = getTodo(req);
  const { todoId, item } = req.body;
  const todo = todoList.addNewItem(todoId, item);
  storeTodoList(userTodo.toJSON());
  res.json(todo);
};

const editItem = function(req, res) {
  const todoList = getTodo(req);
  const { todoId, itemId, item } = req.body;
  const todo = todoList.editItem(todoId, itemId, item);
  storeTodoList(userTodo.toJSON());
  res.json(todo);
};

const editTitle = function(req, res) {
  const todoList = getTodo(req);
  const { todoId, title } = req.body;
  const todo = todoList.editTitle(todoId, title);
  storeTodoList(userTodo.toJSON());
  res.json(todo);
};

const search = function(req, res) {
  const todoList = getTodo(req); 
  res.json(todoList.search(req.query.text));
};

//--------------login

const createSession = function(userName) {
  const session = `${new Date().getTime()}${Math.ceil(Math.random() * 100)}`;
  sessionIds[session] = {
    userName,
    todo: userTodo.getTodoList(userName)
  };

  return session;
};

const setCookie = function(res, sessionId) {
  res.setHeader('set-Cookie', [`sessionId=${sessionId}`]);
};

const validateLoggedUser = function(req, res) {
  const { usrName, password } = req.body;
  if (users.validate(usrName, password)) {
    const session = createSession(usrName);
    setCookie(res, session);
    res.redirect('/todo.html');
    return;
  }
  res.redirect('/');
};

const createAccount = function(req, res, next) {
  const details = req.body;
  users.addNewUser(details);
  storeData(config.USERS_DETAIL, users.toJSON());
  next();
};

const validateUsrID = function(req, res) {
  const { usrId } = req.body;
  const isUsrExist = users.isUsrExist(usrId);
  res.json({ isUsrExist });
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
  removeItem,
  createAccount,
  validateUsrID,
  validateLoggedUser
};
