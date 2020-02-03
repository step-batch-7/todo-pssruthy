const addNewTodoInput = function() {
  const tasks = document.getElementById('todoList');
  const input = document.createElement('input');
  input.name = 'items';
  input.classList.add('itemInput');
  input.placeholder = 'Add a to-do...';
  tasks.appendChild(input);
};
