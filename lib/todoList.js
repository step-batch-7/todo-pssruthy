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

  update(itemId) {
    const [todoId] = itemId.split('_');
    const todoToUpdate = this.todoList.find( (todo) => {
      return `${todoId}` === `${todo.id}`;
    });
    todoToUpdate.update(itemId);
  }

  static load(todoLists){
    const todoList = new TodoList();
    todoLists.forEach((todo) => {
      const {title, id, items, time} = todo;
      todoList.add(new Todo(title, id, items, time));
    });
    return todoList;
  }
  toJSON() {
    return JSON.stringify(this.todoList);
  }
}

module.exports = {TodoList};
