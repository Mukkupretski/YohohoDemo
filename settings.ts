const connect: HTMLInputElement = document.querySelector("#connect")!;

function changeServer(e: Event) {
  settings.localhost = connect.checked;
  localStorage.setItem("settings", JSON.stringify(settings));
  connect.removeEventListener("change", changeServer);
  window.location.reload();
}

connect.addEventListener("change", changeServer);

export const settings: { localhost: boolean } = localStorage.getItem("settings")
  ? JSON.parse(localStorage.getItem("settings")!)
  : { localhost: false };
