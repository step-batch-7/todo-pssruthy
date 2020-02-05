class Todo {
  constructor(title, id, items, time) {
    this.title = title;
    this.id = id;
    this.time = time;
    this.items = items;
  }

  update(itemId) {
    const itemToUpdate = this.items.find( (item) => {
      return `${itemId}` === `${item.id}`;
    });
    
    itemToUpdate.isDone = !itemToUpdate.isDone;
  }
}

module.exports = {Todo};
