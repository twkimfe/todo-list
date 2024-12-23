class TodoForm {
  constructor(todoService) {
    this.todoService = todoService;
    this.form = document.createElement("form");
    this.initializeForm();
  }

  initializeForm() {
    this.form.innerHTML = `
    <div class='form-group>
      <label for ='todo-name'>Title</label>
      <input type='text' id='todo-name' required>
    </div>

    <div class='form-group'>
      <label for ='todo-content'>Content</label>
      <textarea id='todo-content' required></textarea>
    </div>

    <div class='form-group'>
      <label for ='todo-status'>Status</label>
      <select id = 'todo-status' required>
        <option value='pending'>미진행</option>
        <option value='in-progress'>진행중</option>
        <option value='completed'>완료</option>
      </select>
    </div>
    
    <button type='submit'>Create Todo</button>
`;

    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();

    const todoData = {
      name: this.form.querySelector("#todo-name").value,
      content: this.form.querySelector("#todo-content").value,
      status: this.form.querySelector("#todo-status").value,
    };

    const newTodo = this.todoService.createTodo(todoData);

    // form 초기화
    this.form.reset();

    // You might want to trigger a custom event or callback here
    // to notify that a new todo was created

    const createEvent = new CustomEvent("todoCreated", { detail: newTodo });
    document.dispatchEvent(createEvent);
  }

  render(container) {
    container.appendChild(this.form);
  }
}
