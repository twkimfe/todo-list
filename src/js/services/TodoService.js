class TodoService {
  constructor() {
    this.todos = [];
  }

  createTodo(todoData) {
    const newTodo = new Todo(todoData);
    this.todos.push(newTodo);
    return newTodo;
  }

  deleteAllTodos() {
    this.todos = [];
    Todo.resetId();
  }
}
