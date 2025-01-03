export function updateButtonsHide(todos) {
  const buttonsElement = document.querySelector(".buttons");
  if (buttonsElement) {
    if (todos.length === 0) {
      buttonsElement.classList.add("hidden");
    } else {
      buttonsElement.classList.remove("hidden");
    }
  }
}
