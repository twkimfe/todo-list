import TodoService from "../services/TodoService.js";

class TodoList {
  constructor() {
    this.todos = [];
    this.todoService = new TodoService();
    this.container = null;
  }

  async mount(container) {
    this.container = container;
    // 초기 데이터 로드
    try {
      this.todos = await this.todoService.getTodos();
      this.render();
    } catch (error) {
      console.error("로딩 실패:", error);
    }
  }

  template() {
    if (this.todos.length === 0) {
      return '<p class="empty-list"> 할 일이 없습니다. "+"를 눌러서 할 일을 추가해보세요!</p>';
    }

    return `
  <ul class="todo-list">
   ${this.todos
     .map(
       (todo) => `
      <li class="todo-item ${todo.status}" data-id="${todo.id}">
        <div class="todo-checkbox">
          <input type="checkbox"
            class="toggle-checkbox"
           ${todo.status === "completed" ? "checked" : ""}>
        </div>

        <div class="todo-content">
          <h3>${todo.name}</h3>
          <p>${todo.content}</p>
          <span class="todo-status">${this.getStatusText(todo.status)}</span>
        </div>

        <div class="todo-actions">
          <button class="edit-btn">수정</button>
          <button class="delete-btn">삭제</button>
        </div>
      </li>`
     )
     .join("")}
  </ul>
  `;
  }

  // todo 상태값 출력 메서드 수정
  getStatusText(status) {
    const statusMap = {
      pending: "미진행",
      "in-progress": "진행중",
      completed: "완료",
    };
    return statusMap[status] || status;
  }

  render() {
    if (this.container) {
      this.container.innerHTML = this.template();
      this.bindEvents();
    }
  }

  bindEvents() {
    this.container.querySeletorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const todoId = e.target.closest(".todo-item").dataset.id;
        this.deleteTodo(todoId);
      });
    });

    this.container.querySeletorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const todoId = e.target.closest(".todo-item").dataset.id;
        this.editTodo(todoId);
      });
    });

    // 체크박스 이벤트
    this.container.querySeletorAll(".toggle-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", async (e) => {
        const todoId = e.target.closest(".todo-item").dataset.id;
        const todo = this.todo.find((todo) => todo.id === todoId);

        if (todo) {
          try {
            await this.todoService.toggleTodo(this.todos);
            // 전체 목록을 다시 불러서 최신 상태 유지
            this.todos = await this.todoService.getTodos();
            this.render();
          } catch (error) {
            console.error("상태 수정 실패:", error);
          }
        }
      });
    });
  }

  async addTodo(todo) {
    try {
      await this.todoService.saveTodos(this.todos);
      // 최신 목록 불러오기
      this.todos = await this.todoService.getTodos();
      this.render();
    } catch (error) {
      console.error("Todo 추가 실패:", error);
    }
  }

  async deleteTodo(todoId) {
    try {
      const success = await this.todoService.deleteTodo(todoId);
      if (success) {
        // 최신 목록 불러오기
        this.todos = await this.todoService.getTodos();
        this.render();
      }
    } catch (error) {
      console.error("Todo 삭제 실패:", error);
    }
  }

  async editTodo(todoId) {
    const todo = this.fine((todo) => todo.id === todoId);
    if (todo) {
      // 수정 이벤트
      this.container.dispatchEvent(
        new CustomEvent("editTodoRequested", {
          detail: { todo },
          bubbles: true,
        })
      );
    }
  }
}

export default new TodoList();
