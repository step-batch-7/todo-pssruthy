const structureItems = function(items){
  return items.reduce((html, itemInfo) => { 
    const {id, isDone, item} = itemInfo;
    const status = isDone ? 'checked' : 'unchecked';
    return `${html}
    </br>
    <div class="item flex spaceBetween" id="${id}">
    <div>
    <input type="checkbox" onclick="updateItemStatus()" ${status}>
    <input type="type" value="${item}" class="editItemInput" onkeydown="editItem()" id="item${id}">
    </div>
    <img src="./img/minus.png" class="removeTodoItemImg" id="del_${id}">
    </div>`; 
  }, '');
};

const formateTodoIndex = function(todoHtml, todo){
  return `${todoHtml}
    <div class="extractedTodo flex" id="${todo.id}" onclick="showItems()" >
      ${todo.title}
      <img src="./img/delete_bin.png" class="removeTodoImg" id="del_${todo.id}">
    </div>`;
};

const drawTodoList = function(todoListString) {
  const todoList = JSON.parse(todoListString);
  const html = todoList.reduce(formateTodoIndex, '');
  const parent = document.getElementById('todoIndex');
  parent.innerHTML = html;
  document.getElementById('todoItems').innerHTML = '';
  // drawAddTodoBoard();
  attachEventListener('removeTodoImg', 'click', removeTodo);
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
  document.getElementById('title').value = `${todo.title}`;
  const html = structureItems(todo.items);
  const div = document.getElementById('todoItems');
  div.innerHTML = html;
  attachEventListener('removeTodoItemImg', 'click', removeItem);
};

const updateTodoActive = function(id){
  const activeTodos = document.querySelectorAll('.activeTodo');
  Array.from(activeTodos).forEach( todo => {
    todo.classList.remove('activeTodo');
  });
  document.getElementById(`${id}`).classList.add('activeTodo');
};

const showItems = function () {
  const todoId = event.target.id;
  sendHttpGetReq(`getTodo?id=${todoId}`, drawItems);
  updateTodoActive(todoId);
};

const attachEventListener = function(className, event, listener) {
  const tags = document.querySelectorAll(`.${className}`);
  Array.from(tags).forEach((tag) => {
    tag.addEventListener(`${event}`, listener);
  });
};

const main = function(){
  sendHttpGetReq('todoList', drawTodoList);
  drawAddTodoBoard();
};
