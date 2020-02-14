const fs = require('fs');

const config = require('./../config');

const storeTodoList = function(todoList) {
  fs.writeFileSync(config.STORAGE_FILE, todoList);
};

const isFileExist = path => {
  return fs.existsSync(path) && fs.statSync(path).isFile();
};

const loadTodo = () => {
  let todoList = '[]';
  if (isFileExist(config.STORAGE_FILE)) {
    todoList = fs.readFileSync(config.STORAGE_FILE, 'utf8');
  }
  return todoList;
};

module.exports = { storeTodoList, loadTodo, isFileExist };
