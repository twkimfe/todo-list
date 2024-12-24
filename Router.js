// Router.js
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentComponent = null;

    window.addEventListener("popstate", () => this.handleRoute());
    document.addEventListener("DOMContentLoaded", () => this.handleRoute());
  }

  handleRoute() {
    const path = window.location.pathname;
    const route = this.routes[path] || this.routes["/"];

    if (this.currentComponent) {
      this.currentComponent.unmount();
    }

    const container = document.getElementById("app");
    this.currentComponent = new route.component(route.props);
    this.currentComponent.mount(container);
  }

  navigate(path) {
    window.history.pushState(null, "", path);
    this.handleRoute();
  }
}
