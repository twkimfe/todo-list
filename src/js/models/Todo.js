// src/js/models/Todo.js

class Todo {
  static nextId = 0;
  // class의 정적 멤버 선언 시 사용, class의 모든 인스턴스가 공요하는 값

  static resetId() {
    Todo.nextId = 0;
  }

  // nextId 반환 메서드 추가
  static getNextId() {
    return Todo.nextId++;
  }

  constructor({ name, dday, status = "pending", previousStatus = null }) {
    if (!name) {
      throw new Error("할 일 이름이 필요합니다");
    }

    // 새 Todo 인스턴스를 생성하는 생성자 메서드
    // 매개변수 name, content, status를 인스턴스 속성으로 설정

    // null 체크를 포함한 ID 할당
    const nextId = Todo.getNextId();
    this.id = nextId !== null ? +nextId : 0;
    this.name = name;
    this.dday = dday;
    this.status = status;
    this.previousStatus = previousStatus;
  }

  update(updateData) {
    const { name, dday, status } = updateData;

    if (name) {
      this.name = name.trim();
    }

    if (dday !== undefined) {
      this.dday = dday;
    }

    if (status) {
      this.status = status;
    }
  }

  toggleStatus() {
    if (this.status === "completed") {
      this.status = "pending";
    } else {
      this.status = "completed";
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      dday: this.dday,
      status: this.status,
      previousStatus: this.previousStatus,
      // 이전 상태 저장
    };
  }
}

export default Todo;
