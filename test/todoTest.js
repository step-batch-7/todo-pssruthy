const assert = require('chai').assert;
const { Todo } = require('./../lib/todo');
const { Item } = require('./../lib/item');

const sampleTodo = {
  title: 'first',
  id: 1,
  items: [{ id: '1_1', task: 'firstTask', status: false }]
};

describe('* class Todo', function() {
  describe('load', function() {
    it('Should give todo with proper instance when item is there', function() {
      const todo = Todo.load(sampleTodo);
      assert.ok(todo instanceof Todo);
      assert.ok(todo.items[0] instanceof Item);
      assert.strictEqual(todo.id, 1);
      assert.strictEqual(todo.title, 'first');
    });

    it('Should give todo with proper instance when item is not there', function() {
      const todo = Todo.load({ title: 'one', id: 1, items: [] });
      assert.ok(todo instanceof Todo);
      assert.isUndefined(todo.items[0]);
      assert.strictEqual(todo.id, 1);
      assert.strictEqual(todo.title, 'one');
    });
  });

  describe('updateItemStatus', function() {
    it('Should toggle status of given item id', function() {
      const todo = Todo.load(sampleTodo);
      todo.updateItemStatus('1_1');
      assert.isTrue(todo.items[0].status);
    });
  });

  describe('removeItem', function() {
    it('Should remove item of given id', function() {
      const todo = Todo.load(sampleTodo);
      todo.removeItem('1_1');
      assert.isUndefined(todo.items[0]);
    });
  });

  describe('nextItemId', function() {
    it('Should give next item id', function() {
      const todo = Todo.load(sampleTodo);
      assert.strictEqual(todo.nextItemId(), '1_2');
    });
  });

  describe('addItem', function() {
    it('Should add item with given task', function() {
      const todo = Todo.load(sampleTodo);
      todo.addItem('new');
      assert.deepStrictEqual(todo.items[1], new Item('1_2', 'new'));
      assert.isTrue(todo.items[1] instanceof Item);
    });
  });

  describe('findItem', function() {
    it('Should find item with given id', function() {
      const todo = Todo.load(sampleTodo);
      assert.deepStrictEqual(
        todo.findItem('1_1'),
        new Item('1_1', 'firstTask')
      );
    });

    it('should give null when id is not present', function() {
      const todo = Todo.load(sampleTodo);
      assert.isUndefined(todo.findItem('2_1'));
    });
  });

  describe('editItem', function() {
    it('Should edit item with given item id and task', function() {
      const todo = Todo.load(sampleTodo);
      todo.editItem('1_1', 'edited');
      assert.deepStrictEqual(todo.items[0], new Item('1_1', 'edited'));
    });
  });

  describe('editTitle', function() {
    it('Should edit its own title', function() {
      const todo = Todo.load(sampleTodo);
      todo.editTitle('edited');
      assert.deepStrictEqual(todo.title, 'edited');
    });
  });

  describe('search', function() {
    it('Should give true when the search text matches with title', function() {
      const todo = Todo.load(sampleTodo);
      assert.isTrue(todo.search('fir'));
    });

    it('Should give true when the search text matches with item', function() {
      const todo = Todo.load(sampleTodo);
      assert.isTrue(todo.search('Task'));
    });

    it('Should give false when the search text not matches with title', function() {
      const todo = Todo.load(sampleTodo);
      assert.isFalse(todo.search('not'));
    });

    it('Should give false when the search text not matches with item', function() {
      const todo = Todo.load(sampleTodo);
      assert.isFalse(todo.search('not'));
    });
  });
});
