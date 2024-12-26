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
    // component가 이미 인스턴스인 경우를 처리
    this.currentComponent =
      typeof route.component === "function"
        ? new route.component(route.props)
        : route.component;
    this.currentComponent.mount(container);
  }

  navigate(path) {
    window.history.pushState(null, "", path);
    this.handleRoute();
  }
}
