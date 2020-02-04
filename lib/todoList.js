const {Todo} = require('./todo');

class TodoList {
  constructor() {
    this.todoList = [];
  }

  add(todo) {
    this.todoList.push(todo);
  }

  id(){
    const length = this.todoList.length;
    const lastElement = this.todoList[length - 1];
    return lastElement ? lastElement.id + 1 : 1;
  }

  static load(todoLists){
    const todoList = new TodoList();
    todoLists.forEach((todo) => {
      const {title, id, items, time} = todo;
      todoList.add(new Todo(title, id, items, time));
    });
    return todoList;
  }
}

module.exports = {TodoList};
