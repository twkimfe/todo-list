// src/js/services/TodoService.js
import Todo from "../models/Todo.js";

class TodoService {
  constructor() {
    // 인스턴스가 있으면 반환
    if (TodoService.instance) {
      return TodoService.instance;
    }
    TodoService.instance = this;
    this.todos = [];
    this.loadFromLocalStorage();
  }

  // 싱글톤 인스턴스 획득 메서드
  static getInstance() {
    if (!TodoService.instance) {
      TodoService.instance = new TodoService();
    }
    return TodoService.instance;
  }

  async loadFromLocalStorage() {
    try {
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        Todo.nextId = Math.max(...parsedTodos.map((todo) => todo.id)) + 1;
        this.todos = parsedTodos;
      }
    } catch (error) {
      console.error("로딩 실패:", error);
      this.todos = [];
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
    return this.todos.findIndex((todo) => todo.id === id);
  }

  async createTodo(todoData) {
    try {
      const newTodo = new Todo(todoData);
      this.todos.push(newTodo);
      this.saveToLocalStorage();
      console.log(
        "localStorage에 저장된 데이터:",
        JSON.parse(localStorage.getItem("todos"))
      ); // localStorage 데이터 확인

      return newTodo;
    } catch (error) {
      console.error("생성 실패:", error);
      throw error;
    }
  }

  async getTodos() {
    return this.todos;
  }

  async updateTodo(id, updateData) {
    try {
      const index = this._findTodoIndex(id);
      // 찾지 못 할 때 null 반환
      if (index === -1) return null;

      this.todos[index] = { ...this.todos[index], ...updateData };
      await this.saveToLocalStorage();
      return this.todos[index];
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
        this.todos[index].done = !this.todos[index].done;
        this.saveToLocalStorage();
        return this.todos[index];
      }
    } catch (error) {
      console.error("토글 실패:", error);
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
const todoService = new TodoService();

export default todoService;
