class Todo {
  constructor(title, id, items, time) {
    this.title = title;
    this.id = id;
    this.time = time;
    this.items = items;
  }
  
  addItem(item) {
    this.items.push(item);
  }
}

module.exports = {Todo};
