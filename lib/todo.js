class Todo {
  constructor(title, id, items, time) {
    this.title = title;
    this.id = id;
    this.time = time;
    this.items = items;
  }

  updateItemStatus(itemId) {
    const item = this.findItem(itemId);
    item.isDone = !item.isDone;
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

  addItem(item) {
    const newItem = {};
    newItem.id = this.nextItemId();
    newItem.isDone = false;
    newItem.item = item;
    this.items.push(newItem);
  }

  findItem(itemId) {
    return this.items.find(item => {
      return `${itemId}` === `${item.id}`;
    });
  }

  editItem(body) {
    const item = this.findItem(body.itemId);
    item.item = body.item;
  }
  editTitle(title) {
    this.title = title;
  }
}

module.exports = { Todo };
