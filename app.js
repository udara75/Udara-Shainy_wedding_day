const passwords = {
  Udara: "Udara@Dec16",
  Shainy: "Shainy@Dec16",
  Grandeezza: "Grandeezza@16",
  VMASTER: "Vmaster@2026",
  "Senuri-Deco": "SenuriDeco@16",
  "WIFI music": "WifiMusic@16",
  Naveen: "Naveen@Dec16",
  Roshen: "Roshen@Dec16",
  Sewwandi: "Sewwandi#16",
  Shehan: "Shehan#2026",
  Sandani: "Sandani@Dec16",
  Dilki: "Dilki#Dec16",
  Udari: "Udari@Dec16",
  Shashik: "Shashik#2026",
  Samith: "Samith@Dec16",
  Ruchira: "Ruchira@Dec16",
  Ruwan: "Ruwan@Dec16",
  Sanda: "Sanda@Dec16",
  Dulitha: "Dulitha@Dec16"
};

const userSelect = document.getElementById("user");
const otherWrap = document.getElementById("other-wrap");
const otherSelect = document.getElementById("other-user");
const form = document.getElementById("login-form");
const error = document.getElementById("login-error");
const gate = document.getElementById("gate");
const home = document.getElementById("home");
const who = document.getElementById("who");

function selectedName() {
  if (userSelect.value === "__other") return otherSelect.value;
  return userSelect.value;
}

userSelect.addEventListener("change", () => {
  const isOther = userSelect.value === "__other";
  otherWrap.hidden = !isOther;
  otherSelect.required = isOther;
  if (!isOther) otherSelect.value = "";
  error.hidden = true;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = selectedName();
  const password = document.getElementById("password").value;
  const ok = name && passwords[name] && passwords[name] === password;
  error.hidden = ok;
  if (!ok) return;
  sessionStorage.setItem("weddingUser", name);
  showHome(name);
});

document.getElementById("sign-out").addEventListener("click", () => {
  sessionStorage.removeItem("weddingUser");
  form.reset();
  otherWrap.hidden = true;
  otherSelect.required = false;
  home.hidden = true;
  gate.hidden = false;
});

function showHome(name) {
  who.textContent = name;
  gate.hidden = true;
  home.hidden = false;
  error.hidden = true;
}

const saved = sessionStorage.getItem("weddingUser");
if (saved && passwords[saved]) showHome(saved);
