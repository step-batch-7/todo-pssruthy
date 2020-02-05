const fs = require('fs');
const querystring = require('querystring');

const {App} = require('./app');
const {TodoList} = require('./todoList');
const {Todo} = require('./todo');

const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = require('./statusCodes');

const STATIC_DIR = `${__dirname}/../public`;
const config = require('./../config');

const ONE = 1;

const notFound = (req, res) => {
  res.statusCode = STATUS_CODE.notFound;
  const notFoundHtml = 
    `<html>
      <body>
        OOPS!!!!!!
        Page Not Found
      </body>
     </html>`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', notFoundHtml.length);
  res.end(notFoundHtml);
};

const isFileNotValid = (path) => {
  const status = fs.existsSync(path) && fs.statSync(path);
  return !status || !status.isFile();
};

const loadTodo = () => {

  if (isFileNotValid(config.STORAGE_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(config.STORAGE_FILE, 'utf8'));
};

const todoList = TodoList.load(loadTodo());

const serveStaticFile = function (request, response, next) {
  const path = getPath(request.url);
  if (isFileNotValid(path)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/);
  const content = fs.readFileSync(path);
  response.statusCode = STATUS_CODE.ok;
  response.setHeader('Content-Type', CONTENT_TYPES[extension]);
  response.setHeader('Content-Length', content.length);
  response.end(content);
};

const structureTodo = function(body) {
  const title = body.title;
  const id = todoList.id();

  const structureTodoItem = function(item, index){
    return {item, isDone: false, id: `${id}_${index + ONE}`};
  };

  const time = new Date();
  const items = typeof body.items === 'object' ? 
    body.items.map(structureTodoItem) :
    [structureTodoItem(body.items, ONE)];
  return new Todo(title, id, items, time);
};

const saveTodoAndRedirect = function(req, res) {
  const todo = structureTodo(req.body);
  todoList.add(todo);
  fs.writeFileSync(config.STORAGE_FILE, JSON.stringify(todoList.todoList));
  res.statusCode = STATUS_CODE.redirection;
  res.setHeader('Location', '/');
  res.end();
};

const getPath = function (path) {
  if (path === '/') {
    return `${STATIC_DIR}/index.html`;
  }
  return `${STATIC_DIR}${path}`;
};

const serveTodoList = function(req, res){
  res.statusCode = STATUS_CODE.ok;
  res.setHeader('Content-Type', CONTENT_TYPES.plain);
  res.end(JSON.stringify(todoList.todoList));
};

const updateItemStatus = function(req, res) {
  todoList.update(req.body.id);
  fs.writeFileSync(config.STORAGE_FILE, todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.end();
};

const readBody = (req, res, next) => {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    req.body = querystring.parse(body);
    next();
  });
};

const app = new App();

app.use(readBody);
app.get('', serveStaticFile);
app.get('/todoList', serveTodoList);
app.post('/saveTodo', saveTodoAndRedirect );
app.post('updateItemStatus', updateItemStatus);
app.use(notFound);

module.exports = {app};
