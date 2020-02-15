const fs = require('fs');
const storeData = function(path, todoList) {
  fs.writeFileSync(path, todoList);
};

const loadData = (path) => {
  let todoList = '[]';
  if (fs.existsSync(path) && fs.statSync(path).isFile()) {
    todoList = fs.readFileSync(path, 'utf8');
  }
  return todoList;
};

module.exports = { storeData, loadData };
