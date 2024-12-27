//./src/js/pages/TodoForm.js
import todoService from "../services/TodoService.js";

class TodoForm {
  // todoService 객체를 class의 프로퍼티로 저장
  constructor() {
    // 싱글톤 인스턴스 사용
    this.todoService = todoService;
    this.formElement = null;
    this.event = {
      onCancel: () =>
        this.dispatchEvent("navigationRequested", { path: "/index.html" }),
      onSubmit: this.handleSubmit.bind(this),
      onStatusChange: this.handleStatusChange.bind(this),
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
    this.bindEvents();
    container.appendChild(this.formElement);
  }

  unmount() {
    if (this.formElement) {
      this.unbindEvents();
      this.formElement.remove();
      this.formElement = null;
    }
  }

  createForm() {
    const form = document.createElement("form");
    form.innerHTML = `
    <div class='form-group'>
      <label for ='todo-name'>할일</label>
        <input type='text' id='todo-name' required>

      <label for ='todo-content'>내용</label>
        <textarea id='todo-content'  placeholder="어떻게 하고 싶나요?" ></textarea>
         
      <label for ='todo-status'>진행 상황</label>
        <select id = 'todo-status' required>
          <option value='pending'>미진행</option>
          <option value='in-progress'>진행중</option>
          <option value='completed'>완료</option>
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
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
    });

    this.formElement.dispatchEvent(event);
  }

  async handleSubmit(event) {
    event.preventDefault();

    const todoData = {
      name: this.formElement.querySelector("#todo-name").value,
      content: this.formElement.querySelector("#todo-content").value,
      status: this.formElement.querySelector("#todo-status").value,
    };

    console.log("Form에서 입력된 데이터:", todoData); // 입력 데이터 확인

    try {
      // 유효성 검사 추가
      if (!todoData.name.trim()) {
        throw new Error("할일은 필수 입력값입니다.");
      }

      // 1. Todo 생성 및 저장
      const newTodo = await this.todoService.createTodo(todoData);
      // 2. todoCreated 이벤트 발생
      this.dispatchEvent("todoCreated", { todo: newTodo });
      // 3. 폼 초기화
      this.formElement.reset();
      // 4. 즉시 홈으로 이동 (setTimeout 제거)
      window.location.href = "/index.html"; // 직접 URL 변경
      // 5. TodoForm 정리
      this.unmount();
    } catch (error) {
      console.error("Error creating todo:", error);
      this.dispatchEvent("error", {
        message:
          error.message ||
          "오류가 생겼습니다, 새로고침 해주세요. 작성 내용은 저장이 안됩니다. 죄송합니다!",
      });
    }
  }

  handleStatusChange(event) {
    this.dispatchEvent("statusChanged", {
      status: event.target.value,
    });
  }
}

export default new TodoForm();
