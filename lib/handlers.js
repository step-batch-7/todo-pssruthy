const fs = require('fs');
const {App} = require('./app');
const CONTENT_TYPES = require('./mimeTypes');
const STATIC_DIR = `${__dirname}/../public`;

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

const app = new App();

app.get('', serveStaticFile);
app.get('', notFound);

module.exports = {app};
