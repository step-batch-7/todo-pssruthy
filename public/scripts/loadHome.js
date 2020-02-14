const getActiveTodoId = () => document.querySelector('.activeTodo').id;

const structureItems = function(items) {
  return items.reduce((html, itemInfo) => {
    const { id, status, task } = itemInfo;
    const done = status ? 'checked' : 'unchecked';
    return `${html}
    </br>
    <div class="item flex spaceBetween" id="${id}">
    <div>
    <input type="checkbox" onclick="updateItemStatus(${getActiveTodoId()},'${id}')" ${done}>
    <input type="type" value="${task}" class="editItemInput" onkeydown="editItem('${id}')" >
    </div>
    <img src="./img/cross.png" class="removeTodoItemImg" onclick="removeItem(${getActiveTodoId()},'${id}')">
    </div>`;
  }, '');
};

const formateTodoIndex = function(todoHtml, { id, title }) {
  return `${todoHtml}
    <div class="extractedTodo flex" id="${id}" >
      <div onclick="showItems(${id})" >${title}</div>
      <img src="./img/delete_bin.png" class="removeTodoImg" onclick=removeTodo(${id})>
    </div>`;
};

const highLightText = function(text, searchedText) {
  return text.replace(
    new RegExp(searchedText, 'g'),
    `<span class="highLight">${searchedText}</span>`
  );
};

const structureTodoCard = function(text, { id, title, items }) {
  return `
  <div class="todoCard" onclick="showItems(${id})">
  <h3>${highLightText(title, text)}</h3>
  <ul>
  ${items.map(({ task }) => `<li>${highLightText(task, text)}</li>`).join('')}
  </ul>
  </div>`;
};

const drawSearchedTodo = function(text, todoListString) {
  const todoList = JSON.parse(todoListString);
  const todoHtml = todoList.map(structureTodoCard.bind(null, text)).join('');
  document.querySelector('#todoCards').innerHTML = todoHtml;
};

const drawTodoList = function(todoListString) {
  const todoList = JSON.parse(todoListString);
  const html = todoList.reduce(formateTodoIndex, '');
  const parent = document.getElementById('todoIndex');
  parent.innerHTML = html;
  document.getElementById('todoItems').innerHTML = '';
};

const modifyVisibility = function(selectorAndProperty) {
  for (const selector in selectorAndProperty) {
    changeDisplayProperty(selector, selectorAndProperty[selector]);
  }
};

const defaultVisibility = () => {
  modifyVisibility({
    newTodo: 'block',
    showTodo: 'none'
  });
  const searchBoard = document.querySelector('#searchBoard');
  configSearchBar(searchBoard, '0vw', '0vh', '');
};

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
  const searchBoard = document.querySelector('#searchBoard');
  configSearchBar(searchBoard, '0vw', '0vh', '');
};

const updateTodoActive = function(id) {
  const activeTodo = document.querySelector('.activeTodo');
  activeTodo && activeTodo.classList.remove('activeTodo');
  document.getElementById(id).classList.add('activeTodo');
};

const showItems = function(todoId) {
  sendHttpGetReq(`getTodo/${todoId}`, drawItems);
  updateTodoActive(todoId);
};

const attachEventListener = function(selector, event, listener) {
  const tags = document.querySelectorAll(selector);
  Array.from(tags).forEach(tag => {
    tag.addEventListener(`${event}`, listener);
  });
};

const setAutocomplete = function(selector, attribute, value) {
  const tags = document.querySelectorAll(selector);
  Array.from(tags).forEach(tag => {
    tag[attribute] = value;
  });
};

const configSearchBar = function(tag, width, height, innerHTML) {
  tag.style.width = width;
  tag.style.height = height;
  tag.innerHTML = innerHTML;
};

const showSearchBoard = function() {
  const searchBoard = document.querySelector('#searchBoard');
  const { width, display } = searchBoard.style;
  if (width === '0vw' || !width) {
    const innerHtml = `<div id="searchBar">
      <input type="search" id="todoSearch" placeholder="Search todo..." autofocus oninput="search()">
      </div>
      <div id="todoCards"></div>`;
    configSearchBar(searchBoard, '70vw', '80vh', innerHtml);
    return;
  }
  configSearchBar(searchBoard, '0vw', '0vh', '');
};

const main = function() {
  sendHttpGetReq('todoList', drawTodoList);
  defaultVisibility();
  attachEventListener('#addTodoDiv', 'click', defaultVisibility);
  attachEventListener('#title', 'keydown', updateTitle);
  attachEventListener('#newItem', 'keydown', addNewItem);
  attachEventListener('#newTitle', 'keydown', saveNewTodo);
  attachEventListener('#searchIcon', 'click', showSearchBoard);
  setAutocomplete('input', 'autocomplete', 'off');
};
