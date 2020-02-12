const matchRoute = (route, req) => {
  if (route.method) {
    return route.method === req.method && req.url.match(route.path);
  }
  return true;
};

class App {
  constructor() {
    this.routes = [];
  }
  use(middleWare) {
    this.routes.push({ handler: middleWare });
  }
  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }
  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }
  patch(path, handler) {
    this.routes.push({ path, handler, method: 'PATCH' });
  }
  delete(path, handler) {
    this.routes.push({ path, handler, method: 'DELETE' });
  }
  serve(req, res) {
    const matchedHandlers = this.routes.filter(route => {
      return matchRoute(route, req);
    });
    const next = function() {
      const router = matchedHandlers.shift();
      router.handler(req, res, next);
    };
    next();
  }
}

module.exports = { App };
