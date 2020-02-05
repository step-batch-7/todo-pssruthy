const {Todo} = require('./todo');

const getIndex = function(todoList, id){
  const length = todoList.length;
  const lastElement = todoList[length - 1];
  if(`${lastElement.id}` === `${id}` || length === 1){ 
    return length - 1;
  }
  return getIndex(todoList.slice(0, -1), id);
};

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
    
    todoToUpdate.updateItemStatus(itemId);
  }

  deleteTodo(todoId){
    const todoIndex = getIndex(this.todoList, todoId);
    this.todoList.splice(todoIndex, 1);
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
