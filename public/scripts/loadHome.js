const structureItems = function(items) {
  return items.reduce((html, itemInfo) => {
    const { id, status, task } = itemInfo;
    const done = status ? 'checked' : 'unchecked';
    return `${html}
    </br>
    <div class="item flex spaceBetween" id="${id}">
    <div>
    <input type="checkbox" onclick="updateItemStatus()" ${done}>
    <input type="type" value="${task}" class="editItemInput" onkeydown="editItem()" id="item${id}">
    </div>
    <img src="./img/minus.png" class="removeTodoItemImg" id="del_${id}">
    </div>`;
  }, '');
};

const formateTodoIndex = function(todoHtml, todo) {
  return `${todoHtml}
    <div class="extractedTodo flex" id="${todo.id}" >
      <div onclick="showItems(${todo.id})" >${todo.title}</div>
      <img src="./img/delete_bin.png" class="removeTodoImg" id="del_${todo.id}">
    </div>`;
};

const drawTodoList = function(todoListString) {
  const todoList = JSON.parse(todoListString);
  const html = todoList.reduce(formateTodoIndex, '');
  const parent = document.getElementById('todoIndex');
  parent.innerHTML = html;
  document.getElementById('todoItems').innerHTML = '';
  attachEventListener('.removeTodoImg', 'click', removeTodo);
};

const modifyVisibility = function(selectorAndProperty) {
  for (const selector in selectorAndProperty) {
    changeDisplayProperty(selector, selectorAndProperty[selector]);
  }
};

const defaultVisibility = modifyVisibility.bind(null, {
  newTodo: 'block',
  showTodo: 'none'
});

const changeDisplayProperty = function(id, property) {
  const board = document.getElementById(`${id}`);
  board.style.display = property;
};

const drawItems = todoString => {
  modifyVisibility({ showTodo: 'block', newTodo: 'none' });
  const todo = JSON.parse(todoString);
  document.getElementById('title').value = `${todo.title}`;
  const html = structureItems(todo.items);
  const div = document.getElementById('todoItems');
  div.innerHTML = html;
  attachEventListener('.removeTodoItemImg', 'click', removeItem);
};

const updateTodoActive = function(id) {
  const activeTodo = document.querySelector('.activeTodo');
  activeTodo && activeTodo.classList.remove('activeTodo');
  document.getElementById(id).classList.add('activeTodo');
};

const showItems = function(todoId) {
  sendHttpGetReq(`getTodo?id=${todoId}`, drawItems);
  updateTodoActive(todoId);
};

const attachEventListener = function(selector, event, listener) {
  const tags = document.querySelectorAll(selector);
  Array.from(tags).forEach(tag => {
    tag.addEventListener(`${event}`, listener);
  });
};

const main = function() {
  sendHttpGetReq('todoList', drawTodoList);
  defaultVisibility();
  attachEventListener('#addTodoDiv', 'click', defaultVisibility);
};
