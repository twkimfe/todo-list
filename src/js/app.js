import { TodoForm } from "./pages/TodoForm.js";
import { TodoService } from "./services/TodoService.js";
import { TodoList } from "./pages/TodoList.js";
import { Router } from "../../Router.js";

const todoService = new TodoService();

const routes = {
  "/new": {
    component: TodoForm,
    props: { todoService },
  },
  "/": {
    component: class MainView {
      constructor(props) {
        this.props = props;
      }

      mount(container) {
        const addButton = document.getElementById("add-todo-btn");
        if (addButton) {
          addButton.addEventListener("click", () => {
            // url를 /new로 변경
            window.history.pushState(null, "", "/new");
            // router에게 경로 변경 알림
            router.handleRoute();
          });
        }
      }
      unmount() {
        const addButton = document.getElementById("add-todo-btn");
        if (addButton) {
          // 이벤트 리스너가 제거된 새 버튼으로 교체, 메모리 누수 방지 위한 클린업 작업
          addButton.replaceWith(addButton.cloneNode(true));
        }
      }
    },
    props: {},
  },
};

const router = new Router(routes);
