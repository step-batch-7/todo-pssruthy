const {Todo} = require('./todo');

const ONE = 1;

const getIndex = function(todoList, id){
  const length = todoList.length;
  const lastElement = todoList[length - ONE];
  if(`${lastElement.id}` === `${id}` || length === ONE){ 
    return length - ONE;
  }
  return getIndex(todoList.slice(0, -ONE), id);
};

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
    const todoIndex = getIndex(this.todoList, todoId);
    this.todoList.splice(todoIndex, ONE);
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
