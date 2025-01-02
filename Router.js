// Router.js
export class Router {
  constructor(routes) {
    if (!routes || typeof routes !== "object") {
      throw new Error("Routes configuration is required");
    }
    this.routes = routes;
    this.currentComponent = null;
    this.initialized = false;
    this.isRedirecting = false;

    // router를 전역으로 사용할 수 있게 설정
    window.router = this;

    // popstate 이벤트 리스너 등록
    const boundHandleRoute = this.handleRoute.bind(this);
    window.removeEventListener("popstate", boundHandleRoute);
    window.addEventListener("popstate", boundHandleRoute);

    // 초기 라우팅은 DOMContentLoaded 이후에만 실행
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    if (this.initialized) return;
    this.handleRoute();
    this.initialized = true;
  }

  handleRoute() {
    const container = document.querySelector(".App");
    if (!container) {
      console.error("Container element not found");
      return;
    }

    const path = window.location.pathname;
    const route = this.routes[path] || this.routes["/"];

    if (!route || !route.component) {
      console.error(`No route found for path: ${path}`);
      if (path === "/edit" && !todoService.editMode.isEdit) {
        this.navigate("/");
        return;
      }
    }

    if (this.currentComponent === route.component) {
      return;
      // 같은 컴포넌트면 재마운트 안 함
    }

    // 현재 컴포넌트 언마운트
    try {
      if (this.currentComponent?.unmount) {
        try {
          this.currentComponent.unmount();
        } catch (error) {
          console.error("Error during unmount:", error);
        }
      }

      // 컴포넌트가 이미 인스턴스임을 가정
      this.currentComponent = route.component;

      if (!this.currentComponent?.mount) {
        throw new Error("Component must implement mount method");
      }
      this.currentComponent.mount(container);
    } catch (error) {
      console.error("Error during component initialization:", error);
      // 무한 루프 방지를 위한 리다이렉트 처리
      if (path !== "/" && !this.isRedirecting) {
        this.isRedirecting = true;
        this.navigate("/");
        setTimeout(() => {
          this.isRedirecting = false;
        }, 0);
      }
    }
  }

  navigate(path) {
    if (typeof path !== "string") {
      console.error("Path must be a string");
      return;
    }
    // 현재 경로와 같으면 무시
    if (path === window.location.pathname || this.isRedirecting) return;

    window.history.pushState(null, "", path);
    this.handleRoute();
  }
}
