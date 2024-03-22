const connect: HTMLInputElement = document.querySelector("#connect")!;

export const settings: { localhost: boolean } = localStorage.getItem("settings")
  ? JSON.parse(localStorage.getItem("settings")!)
  : { localhost: false };

connect.checked = settings.localhost;

function changeServer(e: Event) {
  settings.localhost = connect.checked;
  localStorage.setItem("settings", JSON.stringify(settings));
  connect.removeEventListener("change", changeServer);
  window.location.reload();
}

connect.addEventListener("change", changeServer);
