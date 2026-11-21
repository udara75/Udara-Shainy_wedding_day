const pageAccess = {
  "decorations.html": null,
  "guests.html": ["Udara", "Shainy", "Grandeezza"],
  "menu.html": ["Udara", "Shainy", "Grandeezza", "Roshen", "Shehan", "Shashik"],
  "timeline.html": null,
  "saxophone.html": ["Udara", "Shainy", "Naveen", "Ruwan", "Grandeezza", "WIFI music"]
};

const file = location.pathname.split("/").pop() || "index.html";
const allowed = pageAccess[file];
const name = sessionStorage.getItem("weddingUser");
const ok = Boolean(name) && (!allowed || allowed.includes(name));

if (!ok) {
  location.replace("index.html");
} else {
  document.body.hidden = false;
  const who = document.getElementById("who");
  if (who) who.textContent = name;
}
