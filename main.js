// ./main.js
import { Router } from "./Router.js";
import MainPage from "./src/js/pages/MainPage.js";
import FormPage from "./src/js/pages/FormPage.js";

const routes = {
  "/": { component: MainPage },
  "/new": { component: FormPage },
  "/edit": { component: FormPage },
};

// 앱 초기화 함수
const initializeApp = () => {
  try {
    // root element 확인
    const app = document.querySelector(".App");
    if (!app) {
      throw new Error("Root element (.App) not found");
    }

    // 라우터 초기화 (싱글톤)
    if (!window.router) {
      window.router = new Router(routes);
    }

    // 초기 라우트 처리
    window.router.handleRoute();

    // cleanup 함수 등록
    window.addEventListener("beforeunload", () => {
      if (window.router?.currentComponent?.unmount) {
        window.router.currentComponent.unmount();
      }
    });
  } catch (error) {
    console.error("Failed to initialize application:", error);
    // 에러 발생 시 폴백 UI 표시
    const app = document.querySelector(".App");
    if (app) {
      app.innerHTML = `
      <div class="error-container">
        <h1>앱을 초기화하는 중 오류가 발생했습니다</h1>
        <p>페이지를 새로고침 해주세요</p>
      </div>
    `;
    }
  }
};

// DOM 로드 완료 시 앱 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// 전역 에러 핸들링
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  // 필요한 경우 사용자에게 에러 알림
});
