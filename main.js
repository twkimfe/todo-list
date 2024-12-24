import Home from "./src/Home.js";
import TodoForm from "./src/js/pages/TodoForm.js";

const $app = document.querySelector(".App");

const routes = {
  "/": {
    render: () => {
      $app.innerHTML = Home.template();
      // Home은 template() 사용
    },
  },
  "/new": {
    render: () => {
      // 기존 내용 비우기
      $app.innerHTML = "";
      // TodoForm은 mount 사용
      TodoForm.mount($app);
    },
  },
};

// 클린업 로직
const cleanup = {
  "/new": () => {
    TodoForm.unmount();
  },
};

export const changeUrl = (requestedUrl) => {
  // 현재 라우트 클린업
  const currentPath = window.location.pathname;
  if (cleanup[currentPath]) {
    cleanup[currentPath]();
  }

  // history.pushState로 url 변경
  history.pushState(null, null, requestedUrl);

  routes[requestedUrl].render();
};

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("addTodoBtn")) {
    changeUrl("/new");
  } else if (e.target.getAttribute("type") === "cancel") {
    changeUrl("/");
  }
});

window.addEventListener("load", () => {
  // 현재 URL에 해당하는 라우트 렌더링
  const currentPath = window.location.pathname;
  if (routes[currentPath]) {
    routes[currentPath].render();
  } else {
    //경로 존재하지 않을 때 홈으로 복귀
    routes["/"].render();
  }
});
