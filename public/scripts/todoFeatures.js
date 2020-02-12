const updateItemStatus = function() {
  const itemId = event.target.parentElement.parentElement.getAttribute('id');
  const [todoId] = itemId.split('_');
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
    const title = document.querySelector('#newTitle');
    sendHttpPostReq('saveNewTodo', `title=${title.value}`, loadUpdatedTodo);
    title.value = '';
  }
};

const removeTodo = function() {
  const [, todoId] = event.target.id.split('_');
  const deleteTodoFromUI = () => {
    const activeTodo = document.querySelector('.activeTodo');
    if (activeTodo && todoId === activeTodo.id) {
      defaultVisibility();
    }
    document.getElementById(todoId).remove();
  };
  sendHttpPostReq('removeTodo', `id=${todoId}`, deleteTodoFromUI);
};

const removeItem = function() {
  const id = event.currentTarget.parentElement.id;
  const [todoId] = id.split('_');
  const requestForList = () => {
    sendHttpGetReq(`getTodo?id=${todoId}`, drawItems);
  };
  sendHttpPostReq('removeItem', `id=${id}`, requestForList);
};

const addNewItem = function() {
  if (event.key === 'Enter') {
    const item = document.querySelector('#newItem').value;
    const todoId = document.querySelector('.activeTodo').id;
    document.querySelector('#newItem').value = '';
    sendHttpPostReq('addNewItem', `todoId=${todoId}&item=${item}`, drawItems);
  }
};

const editItem = function() {
  if (event.key === 'Enter') {
    const inputId = event.target.id;
    const [, itemId] = inputId.match(/item(.*)$/);
    const item = document.querySelector(`#${inputId}`).value;
    const todoId = document.querySelector('.activeTodo').id;
    const reqBody = `todoId=${todoId}&itemId=${itemId}&item=${item}`;
    sendHttpPostReq('editItem', reqBody, drawItems);
  }
};

const updateTitle = function() {
  if (event.key === 'Enter') {
    const titleTag = document.querySelector('#title');
    const title = titleTag.value;
    titleTag.blur();
    const todoId = document.querySelector('.activeTodo').id;
    const reqBody = `todoId=${todoId}&title=${title}`;
    sendHttpPostReq('editTitle', reqBody, loadUpdatedTodo);
  }
};

const searchTodo = function() {
  const value = document.getElementById('todoSearch').value;
  sendHttpGetReq(`searchTodo?text=${value}`, drawTodoList);
  defaultVisibility();
};
