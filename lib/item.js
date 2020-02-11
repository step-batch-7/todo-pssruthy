class Item {
  constructor(id, task, status = false) {
    this.id = id;
    this.task = task;
    this.status = status;
  }

  editTask(task) {
    this.task = task;
  }

  updateStatus() {
    this.status = !this.status;
  }
}

module.exports = { Item };
