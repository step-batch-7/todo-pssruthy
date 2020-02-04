const fs = require('fs');
const querystring = require('querystring');

const {App} = require('./app');
const {loadTemplate} = require('./viewTemplates');
const CONTENT_TYPES = require('./mimeTypes');
const {TodoList} = require('./todoList');

const STATIC_DIR = `${__dirname}/../public`;
const STORAGE_FILE = `${__dirname}/../todoInfo.json`;
const TEMP_DIR = `${__dirname}/../templates`;

const ONE = 1;

const notFound = (req, res) => {
  res.statusCode = 404;
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
  if (isFileNotValid(STORAGE_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
};

const todoList = TodoList.load(loadTodo());
let todoId = todoList.id();

const serveStaticFile = function (request, response, next) {
  const path = `${STATIC_DIR}${request.url}`;
  if (isFileNotValid(path)) {
    return next();
  }
  const [, extension] = request.url.match(/.*\.(.*)$/);
  const content = fs.readFileSync(path);
  response.statusCode = 200;
  response.setHeader('Content-Type', CONTENT_TYPES[extension]);
  response.setHeader('Content-Length', content.length);
  response.end(content);
};

const structureTodoItem = function(item, index){
  return {item, isDone: false, id: index + ONE};
};

const structureTodo = function(body) {
  const title = body.title;
  const id = todoId + ONE;
  todoId++;
  const time = new Date();
  const items = typeof body.items === 'object' ? 
    body.items.map(structureTodoItem) :
    [structureTodoItem(body.items, ONE)];

  return {title, id, time, items};
};

const saveTodoAndRedirect = function(req, res) {
  const todo = structureTodo(req.body);
  todoList.add(todo);
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(todoList.todoList));
  res.statusCode = 302;
  res.setHeader('Location', '/');
  res.end();
};

const getTemPath = function (path) {
  if (path === '/') {
    return `${TEMP_DIR}/index.html`;
  }
  return `${TEMP_DIR}${path}`;
};

const serveHomePage = function(req, res, next) {
  const path = getTemPath(req.url);
  if(isFileNotValid(path)) {
    return next();
  }
  const propertyBag = {TodoList: todoList.toHtmlString()};
  const html = loadTemplate('/index.html', propertyBag);
  res.statusCode = 200;
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.setHeader('Content-Length', html.length);
  res.end(html);
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
app.get('/', serveHomePage);
app.get('', serveStaticFile);
app.post('/saveTodo', saveTodoAndRedirect );
app.get('', notFound);

module.exports = {app};
