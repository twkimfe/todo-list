// src/js/services/TodoService.js
export class TodoService {
  constructor() {
    this.todos = [];
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      Todo.nextId = Math.max(...parsedTodos.map((todo) => todo.id)) + 1;
      this.todos = parsedTodos;
    }
  }

  saveToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  _findTodoIndex(id) {
    return this.todos.findIndex((todo) => todo.id === id);
  }

  createTodo(todoData) {
    const newTodo = new Todo(todoData);
    this.todos.push(newTodo);
    this.saveToLocalStorage();
    return newTodo;
  }

  getTodos() {
    return this.todos;
  }

  updateTodo(id, updateData) {
    const index = this._findTodoIndex(id);
    if (index !== -1) {
      this.todos[index] = { ...this.todos[index], ...updateData };
      this.saveToLocalStorage();
      return this.todos[index];
    }
    return null;
  }

  deleteTodo(id) {
    const index = this._findTodoIndex(id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  toggleTodo(id) {
    const index = this._findTodoIndex(id);
    if (index !== -1) {
      this.todos[index].done = !this.todos[index].done;
      this.saveToLocalStorage();
      return this.todos[index];
    }
    return null;
  }

  deleteAllTodos() {
    confirm(
      "진짜 전부 삭제하시겠어요? 복구는 안됩니다!",
      (this.todos = []),
      Todo.resetId()
    );
  }
}
