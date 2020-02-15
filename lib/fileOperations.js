const fs = require('fs');
const storeData = function(path, data) {
  fs.writeFileSync(path, data);
};

const loadData = path => {
  let todoList = '[]';
  if (fs.existsSync(path) && fs.statSync(path).isFile()) {
    todoList = fs.readFileSync(path, 'utf8');
  }
  return todoList;
};

const loadUser = path => {
  let users = '{}';
  if (fs.existsSync(path) && fs.statSync(path).isFile()) {
    users = fs.readFileSync(path, 'utf8');
  }
  return users;
};

module.exports = { storeData, loadData, loadUser };
