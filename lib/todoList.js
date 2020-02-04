class TodoList {
  constructor() {
    this.todoList = [];
  }

  add(todo) {
    this.todoList.push(todo);
  }

  toHtmlString(){
    const html = this.todoList.reduce((todoHtml, todo) => {
      return `${todoHtml}<div class="extractedTodo flex">
          <span>
            <h3>${todo.title}</h3>
          </span>${todo.time}
        </div></br>`;
    }, '');
    return html;
  }

  id(){
    const length = this.todoList.length;
    const lastElement = this.todoList[length - 1];
    return lastElement ? lastElement.id : 1;
  }

  static load(todoLists){
    const todoList = new TodoList();
    todoLists.forEach((todo) => {
      
      todoList.add(todo);
    });
    return todoList;
  }
}

module.exports = {TodoList};
