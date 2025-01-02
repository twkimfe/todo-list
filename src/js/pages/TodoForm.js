//./src/js/pages/TodoForm.js
import todoService from "../services/TodoService.js";
import { getStatusDisplay } from "../utils/statusUtils.js";

class TodoForm {
  // todoService 객체를 class의 프로퍼티로 저장
  constructor() {
    // 싱글톤 인스턴스 사용
    this.todoService = todoService;
    this.formElement = null;
    this.isEventProcessed = false;

    // 이벤트 핸들러 바인딩을 생성자에서 처리
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleEditTodoRequested = this.handleEditTodoRequested.bind(this);

    this.event = {
      onSubmit: this.handleSubmit,
      onCancel: this.handleCancel,
      onStatusChange: this.handleStatusChange,
      onEditTodoRequested: this.handleEditTodoRequested,
    };
  }

  // form data 수집 메서드
  getFormData() {
    return {
      name: this.formElement.querySelector("#todo-name").value,
      dday: this.formElement.querySelector("#d-day").value,
      status: this.formElement.querySelector("#todo-status").value,
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

    // page 마운트 시, 이벤트 리스너 등록
    document.addEventListener(
      "editTodoRequested",
      this.event.onEditTodoRequested
    );
  }

  unmount() {
    if (this.formElement) {
      this.unbindEvents();

      // editTodoRequested 이벤트 리스너 제거 추가
      document.removeEventListener(
        "editTodoRequested",
        this.event.onEditTodoRequested
      );

      this.formElement.remove();
      this.formElement = null;
      // 상태 초기화
      this.todoService.clearEditMode();
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

  // 커스텀 이벤트 처리 동일
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
    const formData = this.getFormData();

    try {
      const editMode = this.todoService.editMode;
      const resultTodo = editMode.isEdit
        ? await this.todoService.updateTodo(editMode.editingId, formData)
        : await this.todoService.createTodo(formData);

      this.dispatchEvent(editMode.isEdit ? "todoUpdated" : "todoCreated", {
        todo: resultTodo,
      });
      this.todoService.clearEditMode();
      window.router?.navigate("/");
    } catch (error) {
      this.handleSubmitError(error);
    }
  }

  handleSubmitError(error) {
    console.error("Form 제출 에러:", error);
    this.dispatchEvent("error", {
      message: error.message || "오류가 발생했습니다.",
    });
  }

  handleCancel() {
    // EditMode 초기화
    this.todoService.clearEditMode();
    if (window.router) {
      window.router.navigate("/");
    }
  }

  handleEditTodoRequested(event) {
    // formElement가 없으면 early return
    if (!this.formElement || !event.detail?.todo) return;

    const todo = event.detail.todo;
    // TodoService에서 상태 관리
    this.todoService.setEditMode(todo);
    this.updateFormWithTodo(todo);
  }

  // todoForm 업데이트 로직 분리
  updateFormWithTodo(todo) {
    const elements = {
      name: this.formElement.querySelector("#todo-name"),
      dday: this.formElement.querySelector("#d-day"),
      status: this.formElement.querySelector("#todo-status"),
      submit: this.formElement.querySelector('button[type="submit"]'),
    };

    // 모든 필드가 존재하는지 확인
    if (Object.values(elements).every((el) => el)) {
      elements.name.value = todo.name || "";
      elements.dday.value = todo.dday || "";
      elements.status.value = todo.status || "pending";
      elements.submit.textContent = "수정";
    }
  }

  handleStatusChange(event) {
    this.dispatchEvent("statusChanged", {
      status: event.target.value,
    });
  }
}

export default TodoForm;
