//./src/js/pages/TodoForm.js
import todoService from "../services/TodoService.js";
import { getStatusDisplay } from "../utils/statusUtils.js";

class TodoForm {
  // todoService 객체를 class의 프로퍼티로 저장
  constructor() {
    // 싱글톤 인스턴스 사용
    this.todoService = todoService;
    this.formElement = null;

    this.isEditMode = false;
    this.editingTodoId = null;

    this.event = {
      onCancel: () => {
        if (window.router) {
          window.router.navigate("/");
        }
      },
      onSubmit: (e) => {
        this.handleSubmit(e);
      },
      onStatusChange: this.handleStatusChange.bind(this),
      onEditTodoStart: this.handleEditTodoStart.bind(this),
    };
  }

  bindEvents() {
    // form 제출 이벤트
    this.formElement.addEventListener("submit", this.event.onSubmit);
    // 취소 버튼 이벤트
    const cancelButton = this.formElement.querySelector(
      'button[type="cancel"]'
    );
    cancelButton.addEventListener("click", this.event.onCancel);

    // 상태 변경 이벤트
    const statusSelect = this.formElement.querySelector("#todo-status");
    statusSelect.addEventListener("click", this.event.onStatusChange);
  }

  unbindEvents() {
    // 이벤트 리스너 제거
    this.formElement.removeEventListener("submit", this.event.onSubmit);

    const cancelButton = this.formElement.querySelector(
      'button[type="cancel"]'
    );
    cancelButton.removeEventListener("click", this.event.onCancel);

    const statusSelect = this.formElement.querySelector("#todo-status");
    statusSelect.removeEventListener("change", this.event.onStatusChange);
  }

  // mount/unmount 생명주기 명확화
  mount(container) {
    // 기존 요소 있을 시 먼저 정리
    if (this.formElement) {
      this.unmount();
    }

    // 새 요소 생성 및 이벤트 바인딩
    this.formElement = this.createForm();
    container.appendChild(this.formElement);
    this.bindEvents(); // 이벤트는 DOM 추가 후 바인딩

    // edit 이벤트 리스너
    document.addEventListener("editTodoStart", this.event.onEditTodoStart);
  }

  unmount() {
    if (this.formElement) {
      this.unbindEvents();

      document.removeEventListener("editTodoStart", this.event.onEditTodoStart);
      this.formElement.remove();
      this.formElement = null;
      // 상태 초기화
      this.isEditMode = false;
      this.editingTodoId = null;
    }
  }

  // createForm 함수에서는 text를 사용
  createForm() {
    const form = document.createElement("form");
    form.innerHTML = `
    <div class='form-group'>
      <label for ='todo-name'>할일</label>
        <input type='text' id='todo-name' required>

      <label for ='todo-content'>D-Day 설정</label>
        <input type='date' id='d-day'></input>
         
      <label for ='todo-status'>진행 상황</label>
        <select id = 'todo-status' required>
       <option value='pending'>${getStatusDisplay("pending", "text")}</option>
        <option value='in-progress'>${getStatusDisplay(
          "in-progress",
          "text"
        )}</option>
        <option value='completed'>${getStatusDisplay(
          "completed",
          "text"
        )}</option>
        </select>
    <div class='button-container'>
      <button type='cancel'>취소</button>
    <button type='submit'>추가</button>
    </div>
  </div>
`;
    return form;
  }

  // 커스텀 이벤트 치러 동일
  dispatchEvent(eventName, detail = {}) {
    // 이벤트가 이미 처리되었는지 확인하는 플래그 추가
    if (this.isEventProcessed) return;

    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
    });

    this.formElement.dispatchEvent(event);

    // 이벤트 처리 완료 표시
    this.isEventProcessed = true;

    // 다음 이벤트를 위해 setTimeout으로 플래그 초기화
    setTimeout(() => {
      this.isEventProcessed = false;
    }, 0);
  }

  async handleSubmit(event) {
    event.preventDefault();

    // 폼 전체 비활성화
    const submitButton = this.formElement.querySelector(
      'button[type="submit"]'
    );
    const inputs = this.formElement.querySelectorAll("input,  select, button");

    try {
      submitButton.disabled = true; // 버튼 비활성화
      // 모든 입력 요소 비활성화
      inputs.forEach((input) => (input.disabled = true));

      const todoData = {
        name: this.formElement.querySelector("#todo-name").value,
        dday: this.formElement.querySelector("#d-day").value,
        status: this.formElement.querySelector("#todo-status").value,
      };

      // 유효성 검사 추가
      if (!todoData.name.trim()) {
        throw new Error("할일은 필수 입력값입니다.");
      }

      let resultTodo;
      // 수정 모드, 생성 모드 분리
      if (this.isEditMode) {
        resultTodo = await this.todoService.updateTodo(
          this.editingTodoId,
          todoData
        );

        const todoUpdatedEvent = new CustomEvent("todoUpdated", {
          detail: { todo: resultTodo },
          bubbles: true,
          composed: true,
        });
        this.formElement.dispatchEvent(todoUpdatedEvent);
      } else {
        // Todo 생성 및 저장
        resultTodo = await this.todoService.createTodo(todoData);

        // 이벤트 객체 직접 생성
        const todoCreatedEvent = new CustomEvent("todoCreated", {
          detail: { todo: resultTodo },
          bubbles: true,
          composed: true,
        });

        // dispatchEvent 메서드 대신 직접 이벤트 발생
        this.formElement.dispatchEvent(todoCreatedEvent);
      }

      if (window.router) {
        window.router.navigate("/");
      }
    } catch (error) {
      console.error(
        this.isEditMode ? "Error updating todo:" : "Error creating todo:",
        error
      );
      submitButton.disabled = false;
      inputs.forEach((input) => (input.disabled = false));

      this.dispatchEvent("error", {
        message: error.message || "오류가 생겼습니다, 죄송합니다!",
      });
    }
  }

  handleEditTodoStart(event) {
    const todo = event.detail.todo;
    this.isEditMode = true;
    this.editingTodoId = todo.id;

    const nameInput = this.formElement.querySelector("#todo-name");
    const ddayInput = this.formElement.querySelector("#d-day");
    const statusSelect = this.formElement.querySelector("#todo-status");

    if (nameInput && ddayInput && statusSelect) {
      nameInput.value = todo.name;
      ddayInput.value = todo.dday;
      statusSelect.value = todo.status;
    }

    // btn 텍스트 변경
    const submitButton = this.formElement.querySelector(
      'button[type="submit"]'
    );
    if (submitButton) {
      submitButton.textContent = "수정";
    }
  }

  handleStatusChange(event) {
    this.dispatchEvent("statusChanged", {
      status: event.target.value,
    });
  }
}

export default TodoForm;
