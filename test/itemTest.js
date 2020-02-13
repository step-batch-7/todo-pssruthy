const assert = require('chai').assert;
const { Item } = require('./../lib/item');

describe('* class Item', function() {
  describe('constructor', function() {
    it('should construct the item as expected', function() {
      const item = new Item('1_1', 'task');
      assert.strictEqual(item.id, '1_1');
      assert.strictEqual(item.task, 'task');
      assert.strictEqual(item.status, false);
    });
  });

  describe('editTask', function() {
    it('should edit the task name as given', function() {
      const item = new Item('1_1', 'task', true);
      item.editTask('editedTask');
      assert.strictEqual(item.task, 'editedTask');
    });
  });

  describe('updateStatus', function() {
    it('should update the status when previously it was true', function() {
      const item = new Item('1_1', 'task', true);
      item.updateStatus();
      assert.isFalse(item.status);
    });

    it('should update the status when previously it was false', function() {
      const item = new Item('1_1', 'task', false);
      item.updateStatus();
      assert.isTrue(item.status);
    });
  });

  describe('search', function() {
    it('should give true when text matches with task', function() {
      const item = new Item('1_1', 'task', true);
      assert.isTrue(item.search('ta'));
    });

    it('should give false when text does not matches with task', function() {
      const item = new Item('1_1', 'task', true);
      assert.isFalse(item.search('pa'));
    });
  });
});
