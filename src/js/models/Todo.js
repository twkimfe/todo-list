// src/js/models/Todo.js

class Todo {
  static nextId = 0;
  // class의 정적 멤버 선언 시 사용, class의 모든 인스턴스가 공요하는 값

  constructor({ name, content, status }) {
    // 새 Todo 인스턴스를 생성하는 생성자 메서드
    // 매개변수 name, content, status를 인스턴스 속성으로 설정

    this.id = Todo.nextId;
    Todo.nextId += 1;

    this.name = name;
    this.content = content;
    this.status = status;
    this.done = false;
  }
}
