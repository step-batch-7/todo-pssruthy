const addNewTodoInput = function() {
  const tasks = document.getElementById("todoList");
  const input = document.createElement('input');
  input.classList.add('itemInput');
  input.placeholder = 'Add a to-do...';
  console.log(input);
  
  tasks.appendChild(input);
  
}