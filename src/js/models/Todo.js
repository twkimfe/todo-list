// src/js/models/Todo.js

class Todo {
  static nextId = 0;
  // class의 정적 멤버 선언 시 사용, class의 모든 인스턴스가 공요하는 값

  static resetId() {
    Todo.nextId = 0;
  }

  constructor({ name, content, status = "pending" }) {
    if (!name) {
      throw new Error("할 일 이름이 필요합니다");
    }

    // 새 Todo 인스턴스를 생성하는 생성자 메서드
    // 매개변수 name, content, status를 인스턴스 속성으로 설정

    // null 체크 추가

    this.id = Todo.nextId++;
    this.name = name;
    this.content = content;
    this.status = status;
    this.completed = false;
  }

  update(updateData) {
    const { name, content, status } = updateData;

    if (name) {
      this.name = name.trim();
    }

    if (content !== undefined) {
      this.content = content.trim();
    }

    if (status) {
      this.status = this.status;
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
      content: this.content,
      status: this.status,
    };
  }
}

export default Todo;
