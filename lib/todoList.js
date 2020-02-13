const { Todo } = require('./todo');

class TodoList {
  constructor() {
    this.todoList = [];
  }

  static load(content) {
    const todoHistory = JSON.parse(content || '[]');
    const todoLists = new TodoList();
    todoHistory.forEach(todo => todoLists.todoList.push(Todo.load(todo)));
    return todoLists;
  }

  nextTodoId() {
    const lastElement = this.todoList[this.todoList.length - 1];
    return lastElement ? lastElement.id + 1 : 1;
  }

  findTodo(todoId) {
    return this.todoList.find(todo => `${todoId}` === `${todo.id}`);
  }

  toggleStatus(todoId, itemId) {
    const todoToUpdate = this.findTodo(todoId);
    todoToUpdate.updateItemStatus(itemId);
  }

  deleteTodo(todoId) {
    const todo = this.findTodo(todoId);
    const indexOfTodo = this.todoList.indexOf(todo);
    this.todoList.splice(indexOfTodo, 1);
  }

  removeItem(todoId, itemId) {
    const todo = this.findTodo(todoId);
    if (todo) {
      todo.removeItem(itemId);
    }
  }

  toJSON() {
    return JSON.stringify(this.todoList, null, 2);
  }

  createAndGiveTodo(title) {
    const todo = new Todo(title, this.nextTodoId(), []);
    this.todoList.push(todo);
    return todo;
  }

  addNewItem(todoId, item) {
    const todoToAdd = this.findTodo(todoId);
    todoToAdd.addItem(item);
    return todoToAdd;
  }

  editItem(todoId, itemId, item) {
    const todo = this.findTodo(todoId);
    todo.editItem(itemId, item);
    return todo;
  }

  editTitle(todoId, title) {
    const todo = this.findTodo(todoId);
    todo.editTitle(title);
    return todo;
  }

  search(text) {
    return this.todoList.filter(todo => todo.search(text));
  }
}

module.exports = { TodoList };
