const updateItemStatus = function() {
  const itemId = event.target.parentElement.parentElement.getAttribute('id');
  const todoId = itemId.split('_');
  const requestForList = () => {
    sendHttpGetReq(`getTodo?id=${todoId}`, drawItems);
  };  
  sendHttpPostReq('updateItemStatus', requestForList, `id=${itemId}` );
};

const structureItems = function(items){
  return items.reduce((html, itemInfo) => { 
    const {id, isDone, item} = itemInfo;
    const status = isDone ? 'checked' : 'unchecked';
    return `${html}
    </br>
    <div class="item flex spaceBetween" id="${id}">
    <div>
    <input type="checkbox" onclick="updateItemStatus()" ${status}>
    ${item}
    </div>
    <img src="./img/minus.png" class="removeTodoItemImg" id="del_${id}">
    </div>`; 
  }, '');
};

const formateTodoIndex = function(todoHtml, todo){
  return `${todoHtml}
    <div class="extractedTodo flex" id="${todo.id}" onclick="showItems()" >
      <span>
        <h3>${todo.title}</h3>
      </span>
      <img src="./img/delete_bin.png" class="removeTodoImg" id="del_${todo.id}">
    </div>`;
};

const structureTodoList = function(todoListString) {
  const todoList = JSON.parse(todoListString);
  const html = todoList.reduce(formateTodoIndex, '');
  const parent = document.getElementById('todoIndex');
  parent.innerHTML = html;
  document.getElementById('todoItems').innerHTML = '';
  attachEventListener('removeTodoImg', 'click', removeTodo);
};

const saveNewTodo = function(){

  const loadNewTodo = (newTodo) => {
    sendHttpGetReq('todoList', structureTodoList);
    drawItems(newTodo);
  };

  if(event.key === 'Enter'){
    const title = document.querySelector('#newTitle').value;
    sendHttpPostReq('saveNewTodo', loadNewTodo, `title=${title}`);
  }  
};

const drawAddTodoBoard = function(){
  changeDisplayProperty('newTodo', 'block');
  changeDisplayProperty('showTodo', 'none');
};

const changeDisplayProperty = function(id, property) {
  const board = document.getElementById(`${id}`);
  board.style.display = property;
};

const drawItems = (todoString) => {
  changeDisplayProperty('showTodo', 'block');
  changeDisplayProperty('newTodo', 'none');
  const todo = JSON.parse(todoString);
  const html = structureItems(todo.items);
  const div = document.getElementById('todoItems');
  div.innerHTML = html;
  attachEventListener('removeTodoItemImg', 'click', removeItem);
};

const showItems = function () {
  const todoId = event.target.id;
  sendHttpGetReq(`getTodo?id=${todoId}`, drawItems);
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

const attachEventListener = function(className, event, listener) {
  const tags = document.querySelectorAll(`.${className}`);
  Array.from(tags).forEach((tag) => {
    tag.addEventListener(`${event}`, listener);
  });
};

const main = function(){
  sendHttpGetReq('todoList', structureTodoList);
};
