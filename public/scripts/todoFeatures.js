const updateItemStatus = function() {
  const itemId = event.target.parentElement.parentElement.getAttribute('id');
  const todoId = itemId.split('_');
  const requestForList = () => {
    sendHttpGetReq(`getTodo?id=${todoId}`, drawItems);
  };  
  sendHttpPostReq('updateItemStatus', requestForList, `id=${itemId}` );
};

const loadUpdatedTodo = (newTodo) => {
  sendHttpGetReq('todoList', (list) => {
    drawTodoList(list);
    updateTodoActive(JSON.parse(newTodo).id);
    drawItems(newTodo);
  });
};

const saveNewTodo = function(){
  if(event.key === 'Enter'){
    const title = document.querySelector('#newTitle');
    sendHttpPostReq('saveNewTodo', loadUpdatedTodo, `title=${title.value}`);
    title.value = '';
  }  
};

const removeTodo = function(){
  const [, todoId] = event.target.id.split('_');
  sendHttpPostReq('removeTodo', () => {
    sendHttpGetReq('todoList', (todoList) => {
      drawTodoList(todoList);
      drawAddTodoBoard();
    });
  }, `id=${todoId}`);
};

const removeItem = function(){
  const id = event.currentTarget.parentElement.id;
  const [todoId] = id.split('_');
  const requestForList = () => {
    sendHttpGetReq(`getTodo?id=${todoId}`, drawItems);
  };  
  sendHttpPostReq('removeItem', requestForList, `id=${id}` );
};

const addNewItem = function(){
  if(event.key === 'Enter'){
    const item = document.querySelector('#newItem').value;
    const todoId = document.querySelector('.activeTodo').id;
    document.querySelector('#newItem').value = '';
    sendHttpPostReq('addNewItem', drawItems, `todoId=${todoId}&item=${item}`);
  }  
};

const editItem = function(){
  if(event.key === 'Enter'){
    const inputId = event.target.id;
    const [, itemId] = inputId.match(/item(.*)$/);
    const item = document.querySelector(`#${inputId}`).value;
    const todoId = document.querySelector('.activeTodo').id;
    const reqBody = `todoId=${todoId}&itemId=${itemId}&item=${item}`;
    sendHttpPostReq('editItem', drawItems, reqBody);
  }
};

const updateTitle = function(){
  if(event.key === 'Enter'){
    const title = document.querySelector('#title').value;
    const todoId = document.querySelector('.activeTodo').id;
    const reqBody = `todoId=${todoId}&title=${title}`;
    sendHttpPostReq('editTitle', loadUpdatedTodo, reqBody);
  }
};
