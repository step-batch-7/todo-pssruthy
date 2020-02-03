const fs = require('fs');
const querystring = require('querystring');

const {App} = require('./app');
const CONTENT_TYPES = require('./mimeTypes');
const STATIC_DIR = `${__dirname}/../public`;
const STORAGE_FILE = `${__dirname}/../todoInfo.json`;

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

const todoList = loadTodo();

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
  const content = fs.readFileSync(path);
  response.statusCode = 200;
  response.setHeader('Content-Type', CONTENT_TYPES[extension]);
  response.setHeader('Content-Length', content.length);
  response.end(content);
};

const structureTodoItem = function(item){
  return {item, isDone: false};
};

const structureTodo = function(body) {
  const title = body.title;
  const time = new Date();
  const items = typeof body.items === 'object' ? 
    body.items.map(structureTodoItem) :
    [structureTodoItem(body.items)];

  return {title, time, items};
};

const saveTodoAndRedirect = function(req, res) {
  const todo = structureTodo(req.body);
  todoList.unshift(todo);
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(todoList));
  res.statusCode = 302;
  res.setHeader('Location', '/');
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
app.post('/saveTodo', saveTodoAndRedirect );
app.get('', notFound);

module.exports = {app};
