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

const structureTodo = function(todoString){};

const structureItems = function(items){
  return items.reduce((html, item) => { 
    return `${html}</br><input type="checkbox">${item.item}`; 
  }, '');
};

const formateTodo = function(todoHtml, todo){
  const time = new Date(todo.time).toLocaleString();
  return `${todoHtml}
        <div class="extractedTodo flex" id="${todo.id}" >
          <span>
            <h3>${todo.title}</h3>
          </span>${time}
        </div>
        <div>
          ${structureItems(todo.items)}
        </div></br>`;
};

const structureTodoList = function(todoListString) {
  const todoList = JSON.parse(todoListString);
  const html = todoList.reduce(formateTodo, '');
  const parent = document.getElementById('todoList');
  parent.innerHTML = html;
};

const main = function(){
  sendHttpGetReq('todoList', structureTodoList);
};
