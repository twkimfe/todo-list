import todoService from "../services/TodoService.js";

class TodoList {
  constructor() {
    this.todos = [];
    // 싱글톤 인스턴스 사용
    this.todoService = todoService;
    this.container = null;

    // 이벤트 리스너 바인딩
    this.handleTodoCreated = this.handleTodoCreated.bind(this);
    this.handleTodoDeleted = this.handleTodoDeleted.bind(this);
    this.handleTodoUpdated = this.handleTodoUpdated.bind(this);
    this.handleTodoToggled = this.handleTodoToggled.bind(this);
  }

  async mount(container) {
    console.log("container:", container);
    console.log("this.todoService:", this.todoService);
    this.container = container;

    // todoCreated 이벤트 리스너 추가
    document.addEventListener("todoCreated", this.handleTodoCreated);
    document.addEventListener("todoDeleted", this.handleTodoDeleted);
    document.addEventListener("todoUpdated", this.handleTodoUpdated);
    document.addEventListener("todoToggled", this.handleTodoToggled);

    await this.refreshTodos();
    console.log("refreshTodos 완료");
  }

  async refreshTodos() {
    try {
      console.log("TodoService 상태:", this.todoService);
      this.todos = await this.todoService.getTodos();
      console.log("가져온 todos:", this.todos);
      this.render();
    } catch (error) {
      console.error("data 새로고침 실패:", error);
    }
  }

  // 새 todo 생성 이벤트 핸들러
  async handleTodoCreated(event) {
    console.log("todo 생성됨:", event.detail);
    await this.refreshTodos();
  }

  async handleTodoDeleted(event) {
    console.log("todo 삭제됨:", event.detail);
    await this.refreshTodos();
  }

  async handleTodoUpdated(event) {
    console.log("todo 수정됨:", event.detail);
    await this.refreshTodos();
  }

  async handleTodoToggled(event) {
    console.log("todo 상태 변경됨:", event.detail);
    await this.refreshTodos();
  }

  // unmount시 이벤트 리스너 정리
  unmount() {
    document.removeEventListener("todoCreated", this.handleTodoCreated);
    document.removeEventListener("todoDeleted", this.handleTodoDeleted);
    document.removeEventListener("todoUpdated", this.handleTodoUpdated);
    document.removeEventListener("todoToggled", this.handleTodoToggled);

    this.container = null;
  }

  // TodoForm에서 발생된 event 대응하는 메서드
  notifyTodoChange(eventName, detail) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
    });
    document.dispatchEvent(event);
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
          <p>${todo.name}</p>
          </div>
          
          <div class="todo-actions">
          <span class="todo-status">${this.getStatusText(todo.status)}</span>
          <button class="edit-btn">수정</button>
          <button class="delete-btn">X</button>
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

  getStatusClass(status) {
    return status;
  }

  render() {
    if (this.container) {
      this.container.innerHTML = this.template();
      this.bindEvents();
    }
  }

  bindEvents() {
    this.container.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const todoId = e.target.closest(".todo-item").dataset.id;
        this.deleteTodo(todoId);
      });
    });

    this.container.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const todoId = e.target.closest(".todo-item").dataset.id;
        this.editTodo(todoId);
      });
    });

    // 체크박스 이벤트
    this.container.querySelectorAll(".toggle-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", async (e) => {
        const todoId = e.target.closest(".todo-item").dataset.id;
        const todo = this.todos.find((todo) => todo.id === todoId);

        if (todo) {
          try {
            await this.todoService.toggleTodo(todoId);
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
      const newTodo = await this.todoService.createTodo(todo);

      if (newTodo) {
        // 최신 목록 불러오기
        this.todos = await this.todoService.getTodos();
        this.render();
      }
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
    const todo = this.todos.find((todo) => todo.id === todoId);
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
