const storeData = function(writer, path, data) {
  writer(path, data);
};

const loadData = (isExist, stat, reader, path) => {
  let userTodo = '{}';
  if (isExist(path) && stat(path).isFile()) {
    userTodo = reader(path, 'utf8');
  }
  return userTodo;
};

module.exports = { storeData, loadData };
