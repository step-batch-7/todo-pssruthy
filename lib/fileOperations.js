const fs = require('fs');

const config = require('./../config');

const storeTodoList = function(todoList){
  fs.writeFileSync(config.STORAGE_FILE, todoList);
};

const isFileNotValid = (path) => {
  const status = fs.existsSync(path) && fs.statSync(path);
  return !status || !status.isFile();
};

const loadTodo = () => {
  let todoList = [];
  if (!isFileNotValid(config.STORAGE_FILE)) {
    todoList = JSON.parse(fs.readFileSync(config.STORAGE_FILE, 'utf8'));
  }
  return todoList;
};

const loadFile = function(path){  
  return fs.readFileSync(path);
}; 

module.exports = {storeTodoList, loadTodo, isFileNotValid, loadFile};
