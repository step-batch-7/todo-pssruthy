const getTodo = function(req) {
  const { sessionId } = req.cookies;
  return req.sessionIds[sessionId].todo;
};

const saveNewTodo = function(req, res) {
  const todoList = getTodo(req);
  const todo = todoList.createAndGiveTodo(req.body.title);
  req.storeTodoList(req.userTodo.toJSON());
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
  req.storeTodoList(req.userTodo.toJSON());
  res.end();
};

const removeTodo = function(req, res) {
  const todoList = getTodo(req);
  todoList.deleteTodo(req.body.todoId);
  req.storeTodoList(req.userTodo.toJSON());
  res.end();
};

const removeItem = function(req, res) {
  const todoList = getTodo(req);
  const { itemId, todoId } = req.body;
  todoList.removeItem(todoId, itemId);
  req.storeTodoList(req.userTodo.toJSON());
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
  req.storeTodoList(req.userTodo.toJSON());
  res.json(todo);
};

const editItem = function(req, res) {
  const todoList = getTodo(req);
  const { todoId, itemId, item } = req.body;
  const todo = todoList.editItem(todoId, itemId, item);
  req.storeTodoList(req.userTodo.toJSON());
  res.json(todo);
};

const editTitle = function(req, res) {
  const todoList = getTodo(req);
  const { todoId, title } = req.body;
  const todo = todoList.editTitle(todoId, title);
  req.storeTodoList(req.userTodo.toJSON());
  res.json(todo);
};

const search = function(req, res) {
  const todoList = getTodo(req);
  res.json(todoList.search(req.query.text));
};

//--------------login

const createSession = function({ sessionIds, userTodo }, userName) {
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
  if (req.users.validate(usrName, password)) {
    const session = createSession(req, usrName);
    setCookie(res, session);
    res.redirect('/user/todo.html');
    return;
  }
  res.redirect('/');
};

const createAccount = function(req, res, next) {
  const details = req.body;
  req.users.addNewUser(details);
  req.storeUsers(req.users.toJSON());
  next();
};

const validateUsrID = function(req, res) {
  const { usrId } = req.body;
  const isUsrExist = req.users.isUsrExist(usrId);
  res.json({ isUsrExist });
};

const logout = function(req, res) {
  const { sessionId } = req.cookies;
  delete req.sessionIds[sessionId];
  res.clearCookie('sessionId');
  res.end();
};

const isAuthorizedUser = function(req, res, next) {
  const { sessionId } = req.cookies;
  if (sessionId in req.sessionIds) {
    return next();
  }
  res.redirect('/');
};

const identifyUser = function(req, res, next) {
  const { sessionId } = req.cookies;
  const isLoginPage = req.url === '/' || req.url.includes('index.html');
  const isSessionPresent = sessionId in req.sessionIds;
  if (isLoginPage && isSessionPresent) {
    return res.redirect('/user/todo.html');
  }
  next();
};

const initialize = function(req, res, next) {
  const {
    users,
    userTodo,
    sessionIds,
    storeTodoList,
    storeUsers
  } = req.app.locals;
  req.users = users;
  req.userTodo = userTodo;
  req.sessionIds = sessionIds;
  req.storeTodoList = storeTodoList;
  req.storeUsers = storeUsers;
  next();
};

module.exports = {
  initialize,
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
  validateLoggedUser,
  logout,
  isAuthorizedUser,
  identifyUser
};
