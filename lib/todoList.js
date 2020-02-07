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

  findTodo(todoId){
    return this.todoList.find( (todo) => {
      return `${todoId}` === `${todo.id}`;
    });
  }

  update(itemId) {
    const [todoId] = itemId.split('_');
    const todoToUpdate = this.findTodo(todoId);
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

  createAndGiveTodo(body){
    const todo = new Todo(body.title, this.nextTodoId(), [], new Date());
    this.add(todo);
    return todo;
  }
  addNewItem(body){
    const {todoId, item} = body;
    const todoToAdd = this.findTodo(todoId);
    todoToAdd.addItem(item);
    return todoToAdd;
  }
}

module.exports = {TodoList};
