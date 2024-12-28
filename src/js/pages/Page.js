// src/js/pages/Page.js
class Page {
  constructor() {
    this.container = null;
  }

  mount(container) {
    this.container = container;
    this.render();
    this.bindEvents();
  }

  unmount() {
    this.unbindEvents();
    if (this.container) {
      this.container.innerHTML = "";
      this.container = null;
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = this.template();
  }

  template() {
    return "";
  }

  bindEvents() {}

  unbindEvents() {}
}

export default Page;
