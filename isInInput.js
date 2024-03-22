"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let focused = false;
document
    .querySelectorAll('input[type="text"]')
    .forEach((el) => {
    el.addEventListener("focusin", () => {
        focused = true;
    });
    el.addEventListener("focusout", () => {
        focused = false;
    });
});
function isInInput() {
    return focused;
}
exports.default = isInInput;
