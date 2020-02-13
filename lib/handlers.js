const querystring = require('querystring');

const { App } = require('./app');
const { TodoList } = require('./todoList');
const {
  storeTodoList,
  loadTodo,
  isFileExist,
  loadFile
} = require('./fileOperations');

const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = require('./statusCodes');
const STATIC_DIR = `${__dirname}/../public`;

const todoList = TodoList.load(loadTodo());

const getPath = function(path) {
  if (path === '/') {
    return `${STATIC_DIR}/index.html`;
  }
  return `${STATIC_DIR}${path}`;
};

const serveStaticFile = function(request, response, next) {
  const path = getPath(request.url);
  if (!isFileExist(path)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/);
  const content = loadFile(path);
  response.statusCode = STATUS_CODE.ok;
  response.setHeader('Content-Type', CONTENT_TYPES[extension]);
  response.setHeader('Content-Length', content.length);
  response.end(content);
};

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

const notFound = (req, res) => {
  res.statusCode = STATUS_CODE.notFound;
  const notFoundHtml = `<html><body>
        OOPS!!!!!!Page Not Found
      </body></html>`;
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.end(notFoundHtml);
};

const search = function(req, res) {
  const [, body] = req.url.split('?');
  const { text } = querystring.parse(body);
  res.statusCode = 200;
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList.search(text)));
};

const readBody = (req, res, next) => {
  let body = '';
  req.on('data', data => {
    body += data;
  });
  req.on('end', () => {
    req.body = body;
    next();
  });
};

const parseBody = (req, res, next) => {
  req.body = JSON.parse(req.body);
  next();
};

const app = new App();

app.use(readBody);

app.get('', serveStaticFile);
app.get('/todoList', serveTodoList);
app.get('/search', search);
app.get('/getTodo', serveTodo);
app.get('', notFound);

app.use(parseBody);
app.post('saveNewTodo', saveNewTodo);
app.post('addNewItem', addNewItem);

app.patch('updateItemStatus', updateItemStatus);
app.patch('/editItem', editItem);
app.patch('/editTitle', editTitle);

app.delete('/removeTodo', removeTodo);
app.delete('/removeItem', removeItem);

module.exports = { app };
