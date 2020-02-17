const { readFileSync, writeFile, existsSync, statSync } = require('fs');
const { app } = require('./lib/appRouters');
const { Users } = require('./lib/users');
const { UserTodo } = require('./lib/userTodo');
const config = require('./config');
const { storeData, loadData } = require('./lib/fileOperations');

const readData = loadData.bind(null, existsSync, statSync, readFileSync);
const storeTodoList = storeData.bind(null, writeFile, config.STORAGE_FILE);
const storeUsers = storeData.bind(null, writeFile, config.USERS_DETAIL);

app.locals = {
  users: Users.load(readData(config.USERS_DETAIL)),
  userTodo: UserTodo.load(readData(config.STORAGE_FILE)),
  sessionIds: {},
  storeTodoList,
  storeUsers
};

const port = 8080;
app.listen(port, () => process.stdout.write(`Started listening on ${port}`));
