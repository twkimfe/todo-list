// TodoList.js
import todoService from "../services/TodoService.js";
import { getStatusDisplay } from "../utils/statusUtils.js";
import { calculateDday } from "../utils/ddayUtils.js";
import { updateButtonsHide } from "../utils/buttonHideUtils.js";

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
    this.container = container;

    // todoCreated 이벤트 리스너 추가
    document.addEventListener("todoCreated", this.handleTodoCreated);
    document.addEventListener("todoDeleted", this.handleTodoDeleted);
    document.addEventListener("todoUpdated", this.handleTodoUpdated);
    document.addEventListener("todoToggled", this.handleTodoToggled);

    await this.refreshTodos();
  }

  async refreshTodos() {
    try {
      this.todos = await this.todoService.getTodos();
      this.render();

      updateButtonsHide(this.todos);
    } catch (error) {
      console.error("data 새로고침 실패:", error);
    }
  }

  // 새 todo 생성 이벤트 핸들러
  async handleTodoCreated(event) {
    const newTodo = event.detail;
    // 전체 목록 새로고침 대신 새 항목만 추가
    this.todos.push(newTodo);
    this.renderTodo(newTodo);
    console.log("todo 생성됨:", event.detail);
  }

  async handleTodoDeleted(event) {
    const todoId = event.detail;
    // DOM에서 해당 요소만 제거
    const todoElement = this.container.querySelector(`[data-id="${todoId}"]`);
    if (todoElement) {
      todoElement.remove();
    }
    await this.deleteTodo(todoId);
  }

  async handleTodoUpdated(event) {
    const updatedTodo = event.detail;
    // 해당 항목만 업데이트
    const index = this.todos.findIndex((todo) => todo.id === updatedTodo.id);

    if (index !== -1) {
      this.todos[index] = updatedTodo;
      this.updatedTodoElement(updatedTodo);
    }
    console.log("todo 수정됨:", event.detail);
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
     .map((todo) => {
       const dday = calculateDday(todo.dday);
       return `
      <li class="todo-item ${todo.status}" data-id="${todo.id}">
        <div class="todo-checkbox">
          <input type="checkbox"
            class="toggle-checkbox"
           ${todo.status === "completed" ? "checked" : ""}>
        </div>

        <div class="todo-content">
          <p>${todo.name}</p>
        </div>
        
        <div class="dday ${dday.cssClass}">
        <p>${dday.text}</p>
        </div>

        <div class="todo-actions">
          <span class="todo-status">${getStatusDisplay(
            todo.status,
            "icon"
          )}</span>
          <button class="edit-btn"><i class="fas fa-pen"></i></button>
          <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
      </li>`;
     })
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
        // 이벤트 타겟이 i 태그일 수 있으므로 closest로 todo-item을 찾아 id 가져오기
        const todoItem = e.target.closest(".todo-item");
        if (todoItem) {
          const todoId = todoItem.dataset.id;
          this.editTodo(todoId);
        }
      });
    });

    // 체크박스 이벤트
    this.container.querySelectorAll(".toggle-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", async (e) => {
        const todoId = e.target.closest(".todo-item").dataset.id;

        try {
          const updatedTodo = await this.todoService.toggleTodo(todoId);
          // 상태 변경, 화면 갱신
          await this.refreshTodos();
        } catch (error) {
          console.error("상태 수정 실패:", error);
        }
      });
    });

    // todo-status 클릭 이벤트
    this.container.querySelectorAll(".todo-status").forEach((statusElement) => {
      statusElement.addEventListener("click", async (e) => {
        const todoId = e.target.closest(".todo-item").dataset.id;
        try {
          await this.todoService.cycleTodoStatus(todoId);
          this.todos = await this.todoService.getTodos();
          this.render();
        } catch (error) {
          console.error("상태 변경 실패:", error);
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
        updateButtonsHide(this.todos);
      }
    } catch (error) {
      console.error("Todo 삭제 실패:", error);
    }
  }

  async editTodo(todoId) {
    const todo = this.todos.find((todo) => todo.id === Number(todoId));

    if (todo) {
      // 1.먼저 editMode 설정
      this.todoService.setEditMode(todo);
      // 2.라우팅
      if (window.router) {
        window.router.navigate("/edit");
      }
      // 3.이벤트 발생
      setTimeout(() => {
        const editEvent = new CustomEvent("editTodoRequested", {
          detail: { todo },
          bubbles: true,
        });
        document.dispatchEvent(editEvent);
      }, 0);
    }
  }
}

export default new TodoList();
