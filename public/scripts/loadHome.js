const sendHttpGetReq = function(url, callback){
  const req = new XMLHttpRequest();
  req.onload = function(){
    if(this.status === 200) {
      return callback(this.responseText);
    }
  };
  req.open('GET', url);
  req.send();
};

const structureItems = function(items){
  return items.reduce((html, item) => { 
    return `${html}</br><input type="checkbox" id="${item.id}">${item.item}`; 
  }, '');
};

const formateTodo = function(todoHtml, todo){
  const time = new Date(todo.time).toLocaleString();
  return `${todoHtml}
        <div class="extractedTodo flex" id="${todo.id}" onclick="showItems()" >
          <span>
            <h3>${todo.title}</h3>
          </span>${time}
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
};

const showItems = function () {
  const content = event.target.nextElementSibling;
  if (content.style.display === 'block') {
    content.style.display = 'none';
  } else {
    content.style.display = 'block';
  }
};

const main = function(){
  sendHttpGetReq('todoList', structureTodoList);
};
