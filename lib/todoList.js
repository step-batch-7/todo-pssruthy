const { Todo } = require('./todo');

class TodoList {
  constructor() {
    this.todoList = [];
  }

  static load(content) {
    const todoLists = JSON.parse(content || '[]');
    const todoList = new TodoList();
    todoLists.forEach(todo => todoList.add(Todo.load(todo)));
    return todoList;
  }

  add(todo) {
    this.todoList.push(todo);
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
    const todo = new Todo(title, this.nextTodoId(), [], new Date());
    this.add(todo);
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
    return this.todoList.filter(todo => todo.title.match(text));
  }
}

module.exports = { TodoList };
