// src/js/services/TodoService.js
import Todo from "../models/Todo.js";

class TodoService {
  // 싱글톤 인스턴스 저장용 static 변수
  static #instance = null;

  // 생성자
  constructor() {
    // 이미 인스턴스가 있다면 기존 인스턴스 반환
    if (TodoService.#instance) {
      return TodoService.#instance;
    }

    this.todos = [];
    this.loadFromLocalStorage();
    TodoService.#instance = this;

    this.editMode = {
      isEdit: false,
      editingId: null,
      editingData: null,
    };
  }

  setEditMode(todo) {
    this.editMode = {
      isEdit: true,
      editingId: todo.id,
      editingData: { ...todo },
    };
  }

  clearEditMode() {
    this.editMode = {
      isEdit: false,
      editingId: null,
      editingData: null,
    };
  }

  //
  // 싱글톤 인스턴스 획득 메서드
  //
  static getInstance() {
    if (!TodoService.#instance) {
      TodoService.#instance = new TodoService();
    }
    return TodoService.#instance;
  }

  async loadFromLocalStorage() {
    try {
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        // null id를 가진 todo 제거
        this.todos = parsedTodos.filter((todo) => todo.id !== null);

        // ID 재할당: 모든 todo의 id를 0부터 순차적으로 변경
        this.todos = this.todos.map((todo, index) => ({
          ...todo,
          id: index,
        }));

        // 다음 ID 설정
        Todo.nextId = this.todos.length;

        // 변경된 ID로 localStorage 업데이트
        await this.saveToLocalStorage();
      } else {
        // localStorage에 데이터가 없으면 초기화
        this.todos = [];
        Todo.resetId();
      }
    } catch (error) {
      console.error("로딩 실패:", error);
      this.todos = [];
      Todo.resetId();
    }
  }

  async saveToLocalStorage() {
    try {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    } catch (error) {
      console.error("저장 실패:", error);
      throw new Error("저장 실패");
    }
  }

  _findTodoIndex(id) {
    // null 체크 추가
    if (id === null || id === undefined) return -1;
    return this.todos.findIndex((todo) => todo.id === Number(id));
  }

  async createTodo(todoData) {
    try {
      const newTodo = new Todo(todoData);
      this.todos.push(newTodo);
      await this.saveToLocalStorage();

      return newTodo;
    } catch (error) {
      console.error("생성 실패:", error);
      throw error;
    }
  }

  async getTodos() {
    // 배열 복사본 반환
    return [...this.todos];
  }

  async updateTodo(id, updateData) {
    try {
      const index = this._findTodoIndex(Number(id));
      // 찾지 못 할 때 null 반환
      if (index === -1) return null;

      // 기존 데이터 유지하면서 업데이트
      const updatedTodo = {
        ...this.todos[index],
        ...updateData,
        // id 타입 통일
        id: Number(id),
      };

      this.todos[index] = updatedTodo;
      await this.saveToLocalStorage();
      return updatedTodo;
    } catch (error) {
      console.error("수정 실패:", error);
      throw error;
    }
  }

  async deleteTodo(id) {
    try {
      const index = this._findTodoIndex(id);
      if (index === -1) return false;

      this.todos.splice(index, 1);
      await this.saveToLocalStorage();
      return true;
    } catch (error) {
      console.error("삭제 실패:", error);
      throw error;
    }
  }

  async toggleTodo(id) {
    try {
      const index = this._findTodoIndex(id);
      if (index !== -1) {
        const todo = this.todos[index];
        console.log("preStatus:", todo.status);

        // checkbox 토글에 따라 상태 변경
        if (todo.status === "completed") {
          // completed-> todo.status
          todo.status = todo.previousStatus || "pending";
          todo.previousStatus = null;
          // 이전 상태 초기화
          console.log("untoggle", todo.status);
        } else {
          // 현 상태를 previousStatus에 저장하고 completed로 변경
          todo.previousStatus = todo.status;
          todo.status = "completed";
          console.log("toggle", todo.status);
        }
        await this.saveToLocalStorage();
        return todo;
      }
    } catch (error) {
      console.error("토글 실패:", error);
      throw error;
    }
  }

  async cycleTodoStatus(id) {
    try {
      const index = this._findTodoIndex(id);
      if (index !== -1) {
        const currentTodo = this.todos[index];
        const statusCycle = {
          pending: "in-progress",
          "in-progress": "completed",
          completed: "pending",
        };
        currentTodo.status = statusCycle[currentTodo.status];
        await this.saveToLocalStorage();
        return currentTodo;
      }
    } catch (error) {
      console.error("상태 변경 실패", error);
      throw error;
    }
  }

  async deleteAllTodos() {
    try {
      confirm("진짜 전부 삭제하시겠어요? 복구는 안됩니다!");
      this.todos = [];
      Todo.resetId();
      await this.saveToLocalStorage();
      return true;
    } catch (error) {
      console.error("토글 실패:", error);
      throw error;
    }
  }
}
// getInstance()를 통해 단일 인스턴스 export
const todoService = TodoService.getInstance();

export default todoService;
