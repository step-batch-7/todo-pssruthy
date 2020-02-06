const querystring = require('querystring');

const {App} = require('./app');
const {TodoList} = require('./todoList');
const {storeTodoList,
  loadTodo, 
  isFileNotValid, 
  loadFile} = require('./fileOperations');

const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = require('./statusCodes');
const STATIC_DIR = `${__dirname}/../public`;

const todoList = TodoList.load(loadTodo());

const getPath = function (path) {
  if (path === '/') {
    return `${STATIC_DIR}/index.html`;
  }
  return `${STATIC_DIR}${path}`;
};

const serveStaticFile = function (request, response, next) {
  const path = getPath(request.url);
  if (isFileNotValid(path)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/);
  const content = loadFile(path);
  response.statusCode = STATUS_CODE.ok;
  response.setHeader('Content-Type', CONTENT_TYPES[extension]);
  response.setHeader('Content-Length', content.length);
  response.end(content);
};

const saveTodoAndRedirect = function(req, res) {
  todoList.createTodoAndAdd(req.body);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.redirection;
  res.setHeader('Location', '/');
  res.end();
};

const serveTodoList = function(req, res){
  res.statusCode = STATUS_CODE.ok;
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(todoList.toJSON());
};

const updateItemStatus = function(req, res) {
  todoList.update(req.body.id);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.end();
};

const removeTodo = function(req, res){
  todoList.deleteTodo(req.body.id);
  storeTodoList(todoList.toJSON());
  res.statusCode = STATUS_CODE.ok;
  res.end();
};

const notFound = (req, res) => {
  res.statusCode = STATUS_CODE.notFound;
  const notFoundHtml = 
    `<html><body>
        OOPS!!!!!!Page Not Found
      </body></html>`;
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.setHeader('Content-Length', notFoundHtml.length);
  res.end(notFoundHtml);
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
app.post('/removeTodo', removeTodo);
app.use(notFound);

module.exports = {app};
