const assert = require('chai').assert;
const { TodoList } = require('./../lib/todoList');
const { Todo } = require('./../lib/todo');
const { Item } = require('./../lib/item');

const sampleTodoList = [
  {
    title: 'first',
    id: 1,
    items: [{ id: '1_1', task: 'firstTask', status: false }]
  }
];

describe('* class : todoList', function() {
  describe('load', function() {
    it('Should give todoList with proper instance when file is there without any content', function() {
      const todoHistory = TodoList.load('');
      assert.ok(todoHistory instanceof TodoList);
    });

    it('Should give todoList with proper instance when history is not there', function() {
      const todoHistory = TodoList.load('[]');
      assert.ok(todoHistory instanceof TodoList);
    });

    it('Should give todoList with proper instances of Todo & Item', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      assert.ok(todoHistory instanceof TodoList);
      assert.ok(todoHistory.todoList[0] instanceof Todo);
      assert.ok(todoHistory.todoList[0].items[0] instanceof Item);
    });
  });

  describe('nextTodoId', function() {
    it('should give next TodoId when todoHistory is not available', function() {
      const todoHistory = TodoList.load(JSON.stringify([]));
      assert.strictEqual(todoHistory.nextTodoId(), 1);
    });

    it('should give next TodoId when todoHistory is available', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      assert.strictEqual(todoHistory.nextTodoId(), 2);
    });
  });

  describe('findTodo', function() {
    it('should find Todo with id', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      const todo = todoHistory.findTodo(1);
      assert.ok(todo instanceof Todo);
      assert.strictEqual(todo.id, 1);
      assert.strictEqual(todo.title, 'first');
    });

    it('should give undefined when id is not present', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      assert.isUndefined(todoHistory.findTodo(2));
    });
  });

  describe('toggleStatus', function() {
    it('should toggle the status of given todoId and itemId', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      todoHistory.toggleStatus(1, '1_1');
      assert.deepStrictEqual(
        todoHistory.todoList[0].items[0],
        new Item('1_1', 'firstTask', true)
      );
    });
  });

  describe('deleteTodo', function() {
    it('should delete the todo of given id', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      todoHistory.deleteTodo(1);
      assert.deepStrictEqual(todoHistory, new TodoList());
    });
  });

  describe('removeItem', function() {
    it('should remove item for given todoId and itemId', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      todoHistory.removeItem(1, '1_1');
      assert.isUndefined(todoHistory.todoList[0].items[0]);
    });

    it('should not remove anything when todo is not there', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      const todoItems = todoHistory.todoList[0].items;
      todoHistory.removeItem(2, '1_1');
      assert.deepStrictEqual(todoHistory.todoList[0].items, todoItems);
    });
  });

  describe('toJSON', function() {
    it('should give json of todoList', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      assert.strictEqual(
        todoHistory.toJSON(),
        JSON.stringify(sampleTodoList, null, 2)
      );
    });
  });

  describe('createAndGiveTodo', function() {
    it('should create new todo and give it back', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      assert.deepStrictEqual(
        todoHistory.createAndGiveTodo('newTodo'),
        new Todo('newTodo', 2, [])
      );
      assert.deepStrictEqual(
        todoHistory.todoList[1],
        new Todo('newTodo', 2, [])
      );
    });
  });

  describe('addNewItem', function() {
    it('should add new item to the todo', function() {
      const sampleTodoList1 = [{ title: 'first', id: 1, items: [] }];
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList1));
      assert.deepStrictEqual(
        todoHistory.addNewItem(1, 'firstTask'),
        Todo.load(sampleTodoList[0])
      );
    });
  });

  describe('editItem', function() {
    it('should edit item of the todo', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      todoHistory.editItem(1, '1_1', 'editedTask');
      const actualEditedTitle = todoHistory.todoList[0].items[0].task;
      const expectedEditedTitle = 'editedTask';
      assert.deepStrictEqual(actualEditedTitle, expectedEditedTitle);
    });
  });

  describe('editTitle', function() {
    it('should edit title of the todo', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      todoHistory.editTitle(1, 'editedTitle');
      const actualEditedTitle = todoHistory.todoList[0].title;
      const expectedEditedTitle = 'editedTitle';
      assert.deepStrictEqual(actualEditedTitle, expectedEditedTitle);
    });
  });

  describe('search', function() {
    it('should search todo by its title', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      assert.deepStrictEqual(todoHistory.search('fir'), todoHistory.todoList);
    });

    it('should search todo by its item', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      assert.deepStrictEqual(todoHistory.search('Task'), todoHistory.todoList);
    });

    it('should search todo by its item', function() {
      const todoHistory = TodoList.load(JSON.stringify(sampleTodoList));
      assert.deepStrictEqual(todoHistory.search('not'), []);
    });
  });
});
