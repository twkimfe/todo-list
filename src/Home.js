import TodoForm from "../src/js/pages/TodoForm.js";
import TodoList from "../src/js/pages/TodoList.js";

class Home {
  constructor() {
    this.container = null;
    this.todoForm = TodoForm;
    this.todoList = TodoList;
  }

  mount(container) {
    this.container = container;
    this.render();
    this.bindEvents();

    // TodoList 마운트
    const todoListContainer = this.container.queryselector("#todo-list");
    this.todoList.mount(todoListContainer);
  }

  template() {
    return `
      <div class="container">
        <header>
          <h1>Todo List</h1>
          <h3>PLAN it, DO it.</h3>
        </header>
        <div id="app">
          <!-- 중복 렌더링 이슈로 form태그 삭제 -->
          <button class="addTodoBtn">+</button>
          <hr class="divider" />
          <ul id="todo-list"></ul>
        </div>
      </div>
  `;
  }
  render() {
    this.container.innerHTML = this.template();
  }

  bindEvents() {
    // +btn click시 TodoForm 표시
    const addButton = this.container.queryselector(".addTodoBtn");
    addButton.addEventListener("click", () => {
      const appContainer = this.container.queryselector("#app");
      this.todoForm.mount(appContainer);
    });

    // TodoForm에서 todo 생성 완료시
    this.container.addEventListener("todoCreated", (event) => {
      const { todo } = event.detail;
      this.todoList.addTodo(todo);
    });

    // Navi 요청 시 (TodoForm 취소 등)
    this.container.addEventListener("navigationRequested", () => {
      this.todoForm.unmount();
    });
  }
}

export default new Home();
