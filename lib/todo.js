const ONE = 1;

const getIndex = function(items, id){
  const length = items.length;
  const lastElement = items[length - ONE];
  if(`${lastElement.id}` === `${id}` || length === ONE){ 
    return length - ONE;
  }
  return getIndex(items.slice(0, -ONE), id);
};

class Todo {
  constructor(title, id, items, time) {
    this.title = title;
    this.id = id;
    this.time = time;
    this.items = items;
  }

  updateItemStatus(itemId) {
    const itemToUpdate = this.items.find( (item) => {
      return `${itemId}` === `${item.id}`;
    });
    itemToUpdate.isDone = !itemToUpdate.isDone;
  }

  removeItem(itemId){
    this.items.splice(getIndex(this.items, itemId), ONE);
  }
}

module.exports = {Todo};
