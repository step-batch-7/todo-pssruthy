const {Todo} = require('./todo');

const ONE = 1;

class TodoList {
  constructor() {
    this.todoList = [];
  }

  add(todo) {
    this.todoList.push(todo);
  }

  nextTodoId(){
    const length = this.todoList.length;
    const lastElement = this.todoList[length - ONE];
    return lastElement ? lastElement.id + ONE : ONE;
  }

  update(itemId) {
    const [todoId] = itemId.split('_');
    const todoToUpdate = this.todoList.find( (todo) => {
      return `${todoId}` === `${todo.id}`;
    });
    todoToUpdate.updateItemStatus(itemId);
  }

  deleteTodo(todoId){
    this.todoList = this.todoList.filter((todo) => { 
      return !(`${todo.id}` === `${todoId}`);
    });
  }

  static load(todoLists){
    const todoList = new TodoList();
    todoLists.forEach((todo) => {
      const {title, id, items, time} = todo;
      todoList.add(new Todo(title, id, items, time));
    });
    return todoList;
  }

  removeItem(itemId){
    const [todoId] = itemId.split('_');
    const todoForUpdate = this.todoList.filter((todo) => { 
      return `${todo.id}` === `${todoId}`;
    });
    if(todoForUpdate){
      todoForUpdate[0].removeItem(itemId);
    }
  }

  toJSON() {
    return JSON.stringify(this.todoList);
  }

  todo(todoId){
    const [todo] = this.todoList.filter((todo) => { 
      return `${todo.id}` === `${todoId}`;
    });
    return todo;
  }

  createTodoAndAdd(body) {
    const title = body.title;
    const id = this.nextTodoId();
    const structureTodoItem = function(item, index){
      return {item, isDone: false, id: `${id}_${index + ONE}`};
    };
    const time = new Date();
    const items = typeof body.items === 'object' ? 
      body.items.map(structureTodoItem) :
      [structureTodoItem(body.items, ONE)];
    this.add(new Todo(title, id, items, time));
  }
}

module.exports = {TodoList};
