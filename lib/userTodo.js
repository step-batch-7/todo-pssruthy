const { TodoList } = require('./todoList');

class UserTodo {
  constructor() {
    this.userTodo = {};
  }

  static load(todoHistory) {
    const userHistory = JSON.parse(todoHistory || '{}');
    const userTodo = new UserTodo();
    for (const user in userHistory) {
      userTodo.userTodo[user] = TodoList.load(userHistory[user]);
    }
    return userTodo;
  }

  getTodoList(userName) {
    if (!(userName in this.userTodo)) {
      this.userTodo[userName] = new TodoList();
    }
    return this.userTodo[userName];
  }

  toJSON() {
    return JSON.stringify(this.userTodo, null, 2);
  }
}

module.exports = { UserTodo };
