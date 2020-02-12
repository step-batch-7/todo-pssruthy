const { Item } = require('./item');
class Todo {
  constructor(title, id, items, time) {
    this.title = title;
    this.id = id;
    this.time = time;
    this.items = items;
  }

  static load(todo) {
    const { title, id, items, time } = todo;
    const newTodo = new Todo(title, id, [], time);
    items.forEach(item => {
      const { id, task, status } = item;
      newTodo.items.push(new Item(id, task, status));
    });
    return newTodo;
  }

  updateItemStatus(itemId) {
    const item = this.findItem(itemId);
    item.updateStatus();
  }

  removeItem(itemId) {
    const item = this.findItem(itemId);
    const indexOfItem = this.items.indexOf(item);
    this.items.splice(indexOfItem, 1);
  }

  nextItemId() {
    const length = this.items.length;
    const lastElement = this.items[length - 1];
    if (lastElement) {
      const [, itemId] = lastElement.id.split('_');
      return `${this.id}_${+itemId + 1}`;
    }
    return `${this.id}_1`;
  }

  addItem(task) {
    const newItemId = this.nextItemId();
    this.items.push(new Item(newItemId, task));
  }

  findItem(itemId) {
    return this.items.find(item => `${itemId}` === `${item.id}`);
  }

  editItem(itemId, task) {
    const item = this.findItem(itemId);
    item.editTask(task);
  }

  editTitle(title) {
    this.title = title;
  }
}

module.exports = { Todo };
