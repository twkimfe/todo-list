export function updateButtonsHide(todos) {
  const buttonsElement = document.querySelector(".buttons");
  if (buttonsElement) {
    if (todos.length === 0) {
      console.log("[Utils] todos가 비어있어 버튼 숨김");
      buttonsElement.classList.add("hidden");
    } else {
      console.log("[Utils] todos가 있어 버튼 표시");
      buttonsElement.classList.remove("hidden");
    }
  }
}
