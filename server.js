const { app } = require('./lib/appRouters');

const port = 8080;
app.listen(port, () => process.stdout.write(`Started listening on ${port}`));
