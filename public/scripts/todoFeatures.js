const getValue = selector => document.querySelector(selector).value;
const setValue = (selector, value) => {
  document.querySelector(selector).value = value;
};

const updateItemStatus = function(todoId, itemId) {
  const requestForList = () => {
    sendHttpGetReq(`getTodo?id=${todoId}`, drawItems);
  };
  sendHttpPostReq('updateItemStatus', `id=${itemId}`, requestForList);
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
    sendHttpPostReq('saveNewTodo', `title=${title}`, loadUpdatedTodo);
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
  sendHttpPostReq('removeTodo', `id=${todoId}`, deleteTodoFromUI);
};

const removeItem = function(todoId, itemId) {
  const requestForList = () => {
    sendHttpGetReq(`getTodo?id=${todoId}`, drawItems);
  };
  sendHttpPostReq('removeItem', `id=${itemId}`, requestForList);
};

const addNewItem = function() {
  if (event.key === 'Enter') {
    const item = getValue('#newItem');
    const todoId = document.querySelector('.activeTodo').id;
    setValue('#newItem', '');
    sendHttpPostReq('addNewItem', `todoId=${todoId}&item=${item}`, drawItems);
  }
};

const editItem = function() {
  if (event.key === 'Enter') {
    const inputId = event.target.id;
    const [, itemId] = inputId.match(/item(.*)$/);
    const item = getValue(`#${inputId}`);
    const todoId = document.querySelector('.activeTodo').id;
    const reqBody = `todoId=${todoId}&itemId=${itemId}&item=${item}`;
    sendHttpPostReq('editItem', reqBody, drawItems);
  }
};

const updateTitle = function() {
  if (event.key === 'Enter') {
    const title = getValue('#title');
    event.target.blur();
    const todoId = document.querySelector('.activeTodo').id;
    const reqBody = `todoId=${todoId}&title=${title}`;
    sendHttpPostReq('editTitle', reqBody, loadUpdatedTodo);
  }
};

const searchTodo = function() {
  const value = getValue('#todoSearch');
  sendHttpGetReq(`searchTodo?text=${value}`, drawTodoList);
  defaultVisibility();
};
