import TodoForm from "../src/js/pages/TodoForm.js";
import TodoList from "../src/js/pages/TodoList.js";

class Home {
  constructor() {
    this.container = null;
    this.todoForm = TodoForm;
    this.todoList = TodoList;
    console.log("Home constructor - todoList:", this.todoList); // 추가
    console.log("TodoList의 todoService 상태:", this.todoList.todoService);
    console.log(
      "TodoList의 todoService의 todos:",
      this.todoList.todoService.todos
    );
  }

  mount(container) {
    console.log("Home mount 시작");
    this.container = container;
    console.log("container 설정됨:", container);

    this.render();
    console.log("render 완료");

    this.bindEvents();
    console.log("이벤트 바인딩 완료");

    // TodoList 마운트
    const todoListContainer = this.container.querySelector("#todo-list");
    console.log("todoListContainer:", todoListContainer); // 추가
    console.log("this.todoList before mount:", this.todoList); // 추가
    this.todoList.mount(todoListContainer);
  }

  unmount() {
    if (this.todoList) {
      this.todoList.unmount();
    }
    if (this.todoForm) {
      this.todoForm.unmount();
    }
    this.container = null;
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
    if (!this.container) return;
    this.container.innerHTML = this.template();
  }

  bindEvents() {
    // +btn click시 TodoForm 표시
    const addButton = this.container.querySelector(".addTodoBtn");
    addButton.addEventListener("click", this.handleAddButtonClick.bind(this));

    // 이벤트 위임으로 이벤트 처리
    this.container.addEventListener(
      "todoCreated",
      this.handleTodoCreated.bind(this)
    );

    this.container.addEventListener(
      "navigationRequested",
      this.handleNavigation.bind(this)
    );
  }

  handleAddButtonClick() {
    const appContainer = this.container.querySelector("#app");
    this.todoForm.mount(appContainer);
  }

  handleTodoCreated(event) {
    try {
      const { todo } = event.detail;
      if (!todo) {
        throw new Error("todo data 미구현");
      }
      this.todoList.addTodo(todo);
    } catch (error) {
      console.error("추가 실패:", error);
    }
  }

  handleNavigation() {
    this.todoForm.unmount();
  }
}

export default new Home();
