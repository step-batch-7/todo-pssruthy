const fs = require('fs');
const storeData = function(path, data) {
  fs.writeFileSync(path, data);
};

const loadData = path => {
  let userTodo = '{}';
  if (fs.existsSync(path) && fs.statSync(path).isFile()) {
    userTodo = fs.readFileSync(path, 'utf8');
  }
  return userTodo;
};

const loadUser = path => {
  let users = '{}';
  if (fs.existsSync(path) && fs.statSync(path).isFile()) {
    users = fs.readFileSync(path, 'utf8');
  }
  return users;
};

module.exports = { storeData, loadData, loadUser };
