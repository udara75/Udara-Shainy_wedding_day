const file = location.pathname.split("/").pop() || "index.html";
const name = sessionStorage.getItem("weddingUser");

if (!WeddingAccess.can(file, name)) {
  location.replace("index.html");
} else {
  document.body.hidden = false;
  const who = document.getElementById("who");
  if (who) who.textContent = name;
  WeddingAccess.mount(file);
}
