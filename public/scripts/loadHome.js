const updateItemStatus = function() {
  const id = event.target.id;
  sendHttpPostReq('updateItemStatus', () => {}, `id=${id}` );
};

const structureItems = function(items){
  return items.reduce((html, itemInfo) => { 
    const {id, isDone, item} = itemInfo;
    const status = isDone ? 'checked' : 'unchecked';
    return `${html}
    </br>
    <input type="checkbox" id="${id}" onclick="updateItemStatus()" ${status}>
    ${item}`; 
  }, '');
};

const formateTodo = function(todoHtml, todo){
  const time = new Date(todo.time).toLocaleString();
  return `${todoHtml}
        <div class="extractedTodo flex" id="${todo.id}" onclick="showItems()" >
          <span>
            <h3>${todo.title}</h3>
          </span>${time}
        <img src="./img/delete_bin.png" class="removeTodo" id="del_${todo.id}">
        </div>
        <div class="items">
          ${structureItems(todo.items)}
        </div></br>`;
};

const structureTodoList = function(todoListString) {
  const todoList = JSON.parse(todoListString);
  const html = todoList.reduce(formateTodo, '');
  const parent = document.getElementById('todoList');
  parent.innerHTML = html;
  attachEventListener('removeTodo', 'click', removeTodo);
};

const showItems = function () {
  const content = event.target.nextElementSibling;
  if (content.style.display === 'block') {
    content.style.display = 'none';
  } else {
    content.style.display = 'block';
  }
};

const removeTodo = function(){
  const [, todoId] = event.target.id.split('_');  
  sendHttpPostReq('removeTodo', () => {
    sendHttpGetReq('todoList', structureTodoList);
  }, `id=${todoId}`);
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
