// src/js/pages/FormPage.js
import Page from "./Page.js";
import TodoForm from "./TodoForm.js";

class FormPage extends Page {
  constructor() {
    super();
    this.todoForm = new TodoForm();
  }

  template() {
    return `
      <div class="form-page">
        <div id="todo-form"></div>
      </div>
    `;
  }

  mount(container) {
    super.mount(container);
    const formContainer = this.container.querySelector("#todo-form");
    if (formContainer) {
      this.todoForm.mount(formContainer);
    }
  }

  unmount() {
    if (this.todoForm) {
      this.todoForm.unmount();
    }
    super.unmount();
  }
}

export default new FormPage();
