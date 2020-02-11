const { Todo } = require('./todo');

const ONE = 1;

class TodoList {
  constructor() {
    this.todoList = [];
  }

  static load(todoLists) {
    const todoList = new TodoList();
    todoLists.forEach(todo => {
      todoList.add(Todo.load(todo));
    });
    return todoList;
  }

  add(todo) {
    this.todoList.push(todo);
  }

  nextTodoId() {
    const length = this.todoList.length;
    const lastElement = this.todoList[length - ONE];
    return lastElement ? lastElement.id + ONE : ONE;
  }

  findTodo(todoId) {
    return this.todoList.find(todo => {
      return `${todoId}` === `${todo.id}`;
    });
  }

  update(itemId) {
    const [todoId] = itemId.split('_');
    const todoToUpdate = this.findTodo(todoId);
    todoToUpdate.updateItemStatus(itemId);
  }

  deleteTodo(todoId) {
    const todo = this.findTodo(todoId);
    const indexOfTodo = this.todoList.indexOf(todo);
    this.todoList.splice(indexOfTodo, 1);
  }

  removeItem(itemId) {
    const [todoId] = itemId.split('_');
    const todo = this.findTodo(todoId);
    if (todo) {
      todo.removeItem(itemId);
    }
  }

  toJSON() {
    return JSON.stringify(this.todoList, null, 2);
  }

  createAndGiveTodo(body) {
    const todo = new Todo(body.title, this.nextTodoId(), [], new Date());
    this.add(todo);
    return todo;
  }

  addNewItem(body) {
    const { todoId, item } = body;
    const todoToAdd = this.findTodo(todoId);
    todoToAdd.addItem(item);
    return todoToAdd;
  }

  editItem(body) {
    const todo = this.findTodo(body.todoId);
    todo.editItem(body);
    return todo;
  }

  editTitle(body) {
    const todo = this.findTodo(body.todoId);
    todo.editTitle(body.title);
    return todo;
  }

  search(text) {
    return this.todoList.filter(todo => {
      return todo.title.match(text);
    });
  }
}

module.exports = { TodoList };
