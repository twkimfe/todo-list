// src/js/pages/MainPage.js
import Page from "./Page.js";
import TodoList from "./TodoList.js";
import todoService from "../services/TodoService.js";

class MainPage extends Page {
  constructor() {
    super();
    this.todoList = TodoList;
    this.currentFilter = null;
  }

  template() {
    return `
      <div class="container">
        <header>
          <h1>Todo List</h1>
          <h3 class="plan-message">PLAN it, DO it.</h3>
        </header>
        <div id="app">
           <button class="addTodoBtn" aria-label="할 일 추가">+</button>
          <br>
        <div class ="buttons">
             <button class="filter" aria-label="필터"><i class="fas fa-filter"></i></button>
              <div class="filter-dropdown hidden">
              <div class="filter-option" data-filter="lastest">최신순</div>
              <div class="filter-option" data-filter="incomplete">미완성</div>
              <div class="filter-option" data-filter="complete">완성</div>
        </div>
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

    // h3-headerHtml click
    let clickCount = 0;
    const messageElement = this.container.querySelector(".plan-message");
    if (messageElement) {
      messageElement.addEventListener("click", () => {
        clickCount++;
        if (clickCount === 5) {
          alert("이용해주셔서 감사합니다, 더 열심히 하겠습니다! :) _TWKim");
          clickCount = 0;
        }
      });
    }

    if (addButton) {
      addButton.addEventListener("click", this.handleAddButtonClick.bind(this));
    }

    if (deleteAllButton) {
      deleteAllButton.addEventListener(
        "click",
        this.handleDeleteAllClick.bind(this)
      );
    }
    // 필터 관련 이벤트 바인딩을 별도 메서드로 분리
    this.bindFilterEvents();
  }

  bindFilterEvents() {
    const filterBtn = this.container.querySelector(".filter");
    const filterDropdown = this.container.querySelector(".filter-dropdown");
    const filterOptions = this.container.querySelectorAll(".filter-option");

    if (!filterBtn || !filterDropdown || !filterOptions.length) return;

    // filter 버튼 클릭 이벤트
    filterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      filterDropdown.classList.toggle("hidden");
    });

    // filter option 클릭 이벤트
    filterOptions.forEach((option) => {
      option.addEventListener("click", async (e) => {
        e.stopPropagation();
        const filterType = e.target.dataset.filter;
        this.currentFilter = filterType;

        // 선택 옵션 스타일링
        filterOptions.forEach((opt) => {
          opt.classList.remove("selected");
        });
        e.target.classList.add("selected");

        // 피터링 실행
        await this.applyFilter(filterType);
        filterDropdown.classList.add("hidden");
      });
    });

    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener("click", () => {
      filterDropdown.classList.add("hidden");
    });
  }

  async applyFilter(filterType) {
    try {
      const filteredTodos = await todoService.getFilteredTodos(filterType);
      this.todoList.todos = filteredTodos;
      this.todoList.render();
    } catch (error) {
      console.error("filter failed:", error);
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
