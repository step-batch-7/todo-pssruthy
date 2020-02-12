const getValue = selector => document.querySelector(selector).value;
const setValue = (selector, value) => {
  document.querySelector(selector).value = value;
};

const updateItemStatus = function(todoId, itemId) {
  sendHttpPostReq('updateItemStatus', { todoId, itemId }, () => {});
};

const loadUpdatedTodo = newTodo => {
  sendHttpGetReq('todoList', list => {
    drawTodoList(list);
    updateTodoActive(JSON.parse(newTodo).id);
    drawItems(newTodo);
  });
};

const saveNewTodo = function() {
  if (event.key === 'Enter') {
    const title = getValue('#newTitle');
    sendHttpPostReq('saveNewTodo', { title }, loadUpdatedTodo);
    setValue('#newTitle', '');
  }
};

const removeTodo = function(todoId) {
  const deleteTodoFromUI = () => {
    const activeTodo = document.querySelector('.activeTodo');
    if (activeTodo && `${todoId}` === activeTodo.id) {
      defaultVisibility();
    }
    document.getElementById(todoId).remove();
  };
  sendHttpPostReq('removeTodo', { todoId }, deleteTodoFromUI);
};

const removeItem = function(todoId, itemId) {
  sendHttpPostReq('removeItem', { todoId, itemId }, () => {});
  sendHttpGetReq(`getTodo?id=${todoId}`, drawItems);
};

const addNewItem = function() {
  if (event.key === 'Enter') {
    const item = getValue('#newItem');
    const todoId = getActiveTodoId();
    setValue('#newItem', '');
    sendHttpPostReq('addNewItem', { todoId, item }, drawItems);
  }
};

const editItem = function(itemId) {
  if (event.key === 'Enter') {
    const item = event.target.value;
    const todoId = getActiveTodoId();
    sendHttpPostReq('editItem', { todoId, itemId, item }, drawItems);
  }
};

const updateTitle = function() {
  if (event.key === 'Enter') {
    const title = getValue('#title');
    event.target.blur();
    const todoId = getActiveTodoId();
    sendHttpPostReq('editTitle', { todoId, title }, loadUpdatedTodo);
  }
};

const searchTodo = function() {
  const value = getValue('#todoSearch');
  sendHttpGetReq(`searchTodo?text=${value}`, drawTodoList);
  defaultVisibility();
};
