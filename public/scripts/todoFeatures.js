const updateItemStatus = function() {
  const itemId = event.target.parentElement.parentElement.getAttribute('id');
  const todoId = itemId.split('_');
  const requestForList = () => {
    sendHttpGetReq(`getTodo?id=${todoId}`, drawItems);
  };  
  sendHttpPostReq('updateItemStatus', requestForList, `id=${itemId}` );
};

const saveNewTodo = function(){
  const loadNewTodo = (newTodo) => {
    sendHttpGetReq('todoList', (list) => {
      structureTodoList(list);
      updateTodoActive(JSON.parse(newTodo).id);
    });
    drawItems(newTodo);
  };
  if(event.key === 'Enter'){
    const title = document.querySelector('#newTitle');
    sendHttpPostReq('saveNewTodo', loadNewTodo, `title=${title.value}`);
    title.value = '';
  }  
};

const removeTodo = function(){
  const [, todoId] = event.target.id.split('_');
  sendHttpPostReq('removeTodo', () => {
    sendHttpGetReq('todoList', structureTodoList);
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
