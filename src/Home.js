// Home.js
import TodoForm from "../src/js/pages/TodoForm.js";
import TodoList from "../src/js/pages/TodoList.js";

console.log("Home loaded");

class Home {
  constructor() {
    this.container = null;
    this.todoForm = TodoForm;
    this.todoList = TodoList;
    this.eventHandlers = new Map();
  }

  mount(container) {
    if (!container) {
      throw new Error("Container element is required");
    }

    try {
      this.cleanup(); // 이전 이벤트 리스너들 정리
      this.container = container;
      this.render();

      // TodoList 컴포넌트 초기화
      const todoListContainer = this.container.querySelector("#todo-list");
      if (todoListContainer) {
        this.todoList.mount(todoListContainer);
      }

      this.bindEvents();
    } catch (error) {
      console.error("Error mounting Home component:", error);
      throw error;
    }
  }

  unmount() {
    try {
      if (this.todoList) {
        this.todoList.unmount();
      }

      this.cleanup();
      this.container = null;
    } catch (error) {
      console.error("Error unmounting Home component:", error);
    }
  }

  cleanup() {
    if (!this.container) return;

    // Map에 저장된 모든 이벤트 리스너 제거
    this.eventHandlers.forEach((handler, eventName) => {
      const [element, event] = eventName.split(":");
      if (element === "container") {
        this.container.removeEventListener(event, handler);
      } else {
        const el = this.container.querySelector(element);
        if (el) {
          el.removeEventListener(event, handler);
        }
      }
    });
    this.eventHandlers.clear();
  }

  template() {
    return `
      <div class="container">
        <header>
          <h1>Todo List</h1>
          <h3>PLAN it, DO it.</h3>
        </header>
        <div id="app">
           <button class="addTodoBtn" aria-label="할 일 추가">+</button>
          <br>
        <div class ="buttons">
             <button class="allDelete" aria-label="전체 삭제">X</button>
        </div>
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
    // 할 일 추가 버튼 이벤트
    const addButton = this.container.querySelector(".addTodoBtn");
    if (addButton) {
      const boundAddHandler = this.handleAddButtonClick.bind(this);
      addButton.addEventListener("click", boundAddHandler);
      this.eventHandlers.set(".addTodoBtn:click", boundAddHandler);
    }

    // Todo 생성 이벤트
    const boundTodoCreatedHandler = this.handleTodoCreated.bind(this);
    this.container.addEventListener("todoCreated", boundTodoCreatedHandler);
    this.eventHandlers.set("container:todoCreated", boundTodoCreatedHandler);
  }

  handleAddButtonClick() {
    console.log("Add button clicked"); // + 버튼 클릭 확인
    if (!window.router) {
      console.error("Router is not initialized");
      return;
    }
    window.router.navigate("/new");
  }

  handleTodoCreated(event) {
    console.log("[Home] todoCreated 이벤트 감지:", event.detail);

    try {
      const { todo } = event.detail;
      if (!todo || typeof todo !== "object") {
        throw new Error("Invalid todo data");
      }

      event.stopPropagation();

      if (this.todoList && typeof this.todoList.addTodo === "function") {
        this.todoList.addTodo(todo);
      }
    } catch (error) {
      console.error("Todo 추가 실패:", error);
    }
  }

  handleNavigation() {
    this.todoForm.unmount();
  }
}

export default new Home();
