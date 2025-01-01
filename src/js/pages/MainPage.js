// src/js/pages/MainPage.js
import Page from "./Page.js";
import TodoList from "./TodoList.js";
import todoService from "../services/TodoService.js";

class MainPage extends Page {
  constructor() {
    super();
    this.todoList = TodoList;
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
             <button class="fliter" aria-label="필터"><i class="fas fa-filter"></i></button>
             <button class="allDelete" aria-label="전체 삭제"><i class="fas fa-trash"></i></button>
        </div>
          <hr class="divider" />
          <ul id="todo-list"></ul>
        </div>
      </div>
  `;
  }

  bindEvents() {
    const addButton = this.container.querySelector(".addTodoBtn");
    const deleteAllButton = this.container.querySelector(".allDelete");

    if (addButton) {
      addButton.addEventListener("click", this.handleAddButtonClick.bind(this));
    }

    if (deleteAllButton) {
      deleteAllButton.addEventListener(
        "click",
        this.handleDeleteAllClick.bind(this)
      );
    }
  }

  handleAddButtonClick() {
    if (window.router) {
      window.router.navigate("/new");
    }
  }

  async handleDeleteAllClick() {
    try {
      const result = await todoService.deleteAllTodos();
      if (result) {
        // 목록 성공 전체 삭제 시, 화면 새로고침
        this.todoList.refreshTodos();
      }
    } catch (error) {
      console.error("삭제 실패 했습니다", error);
    }
  }

  mount(container) {
    super.mount(container);
    const todoListContainer = this.container.querySelector("#todo-list");
    if (todoListContainer) {
      this.todoList.mount(todoListContainer);
    }
  }

  unmount() {
    if (this.todoList) {
      this.todoList.unmount();
    }
    super.unmount();
  }
}

export default new MainPage();
