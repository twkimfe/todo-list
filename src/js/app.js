const todoService = new TodoService();
const todoForm = new TodoForm(todoService);

document.querySelector("#todo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const container = document.querySelector(".container");
  container.innerHTML = "";
  todoForm.render(container);
});

document.addEventListener("todoCreated", (event) => {
  const newTodo = event.detail;
  console.log("New todo created:", newTodo);
  // Here you might want to update the UI or redirect back to the list
});
