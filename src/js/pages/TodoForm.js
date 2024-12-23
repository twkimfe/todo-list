class TodoForm {
  constructor(todoService) {
    this.todoService = todoService;
    this.form = document.createElement("form");
    this.initializeForm();
  }

  initializeForm() {
    this.form.innerHTML = `
    <div class='form-group'>
      <label for ='todo-name'>할일</label>
        <input type='text' id='todo-name' required>

      <label for ='todo-content'>상세</label>
        <textarea id='todo-content'  placeholder="어떻게 하고 싶나요?" ></textarea>
         
      <label for ='todo-status'>진행 상황</label>
        <select id = 'todo-status' required>
          <option value='pending'>미진행</option>
          <option value='in-progress'>진행중</option>
          <option value='completed'>완료</option>
        </select>
    <div class='button-container'>
      <button type='cancel'>취소</button>
    <button type='submit'>추가</button>
    </div>
  </div>
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
