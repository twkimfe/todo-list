// src/js/pages/MainPage.js
import Page from "./Page.js";
import TodoList from "./TodoList.js";

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
             <button class="allDelete" aria-label="전체 삭제">X</button>
        </div>
          <hr class="divider" />
          <ul id="todo-list"></ul>
        </div>
      </div>
  `;
  }

  bindEvents() {
    const addButton = this.container.querySelector(".addTodoBtn");
    if (addButton) {
      addButton.addEventListener("click", this.handleAddButtonClick.bind(this));
    }
  }

  handleAddButtonClick() {
    if (window.router) {
      window.router.navigate("/new");
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
