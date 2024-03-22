let focused: boolean = false;

document
  .querySelectorAll<HTMLInputElement>('input[type="text"]')
  .forEach((el) => {
    el.addEventListener("focusin", () => {
      focused = true;
    });
    el.addEventListener("focusout", () => {
      focused = false;
    });
  });

export default function isInInput(): boolean {
  return focused;
}
