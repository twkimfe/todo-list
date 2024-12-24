class Home {
  template() {
    return `
      <div class="container">
        <header>
          <h1>Todo List</h1>
          <h3>PLAN it, DO it.</h3>
        </header>
        <div id="app">
          <!-- 중복 렌더링 이슈로 form태그 삭제 -->
          <button class="addTodoBtn">ToDo 추가</button>
          <hr class="divider" />
          <ul id="todo-list"></ul>
        </div>
      </div>
  `;
  }
}

export default new Home();
