const passwordHashes = {
  Udara: "cdefa2a403d040ae32957cd24ff379b088ff5217c726edc716a4894721de3352",
  Shainy: "804e9d10d599521419dde77f5785b896a30d1a7cb16e8246c1cac1bc601c18cd",
  Grandeezza: "712588bfcbdabb387fc925236712f0acf0b7287006eaf35b6e1233c40611c72f",
  VMASTER: "0b31a10501578cee3cad9f93af954873dc59019534db8a66c55831b991cebbfa",
  "Senuri-Deco": "66ac6680340822ee3680bc2a1060dc0f4a06dd6909694f17b6b2b90a8a4d2369",
  "WIFI music": "48e15f9605545a84514bb52a2bc4aab3746460a3825e5a4e37df2725bc99cd88",
  Naveen: "1c008e1d921bb91f0a55310a49953a2d0aa7a8c9e8e4cb44bf7f1680b22e782f",
  Roshen: "f5440c27d2825271fab7eec73a128c98fcd4eaaf686f7cd515f2bb029d10f55d",
  Sewwandi: "44668d137ddac59c0f14fb0090e013f0ea28241a047015cd172fac301ca172dd",
  Shehan: "ca5eccc4f6ca68c7d272312ea16c29d63f88e82a0f0f719ba4215c5b461a7c5d",
  Sandani: "fcd01baf077835881ea2d4dc3b7b90948b0f9f5e63997c66dabd23c3516421ae",
  Dilki: "55aa9a6d9a5ccb115d3ee325d797eaf9184056fc4df00a048bfd2cf6aaf49e76",
  Udari: "5ba038864e39e1c40d0b49ea47480023a21eb5e69549e2b6e612b130ee0d213e",
  Shashik: "fa61d8ee03e0eef1807335d5b61e578f16e5c5c31ff4c0370a7baaf0d8d2cbc8",
  Samith: "00574aeed95c238c4e828002f7e33b51ffa78f7f039d0fbcf5d5aa21e273c709",
  Ruchira: "9ddf54008bb9a7fd0c482bf57ec680f032964a680258fd9dc51248b25f90b3b5",
  Ruwan: "71cf04b9d6bc0a29f37aee8633534188a6d04be454099f9e44a465d7a111ca86",
  Sanda: "73719a969b07c88666aaf6534044ea0c11f8c4d46b3b49d89a2e205443d67620",
  Dulitha: "acebf8f04c8bf574a6ee05c68b2f685416a9d66e5e57a3892da3d05f70ceed89"
};

const MAX_TRIES = 5;
const LOCK_MS = 60 * 1000;

const userSelect = document.getElementById("user");
const otherWrap = document.getElementById("other-wrap");
const otherSelect = document.getElementById("other-user");
const form = document.getElementById("login-form");
const error = document.getElementById("login-error");
const passwordInput = document.getElementById("password");
const sections = [
  { icon: "💐", title: "Hotel Decorations", note: "Flowers, fabric, and room styling", href: "decorations.html" },
  { icon: "🪑", title: "Guest list and tables", note: "Names, seats, and table plan", href: "guests.html" },
  { icon: "🍽️", title: "Hotel Menu", note: "Dishes, drinks, and service", href: "menu.html" },
  { icon: "⏳", title: "Event timeline", note: "The order of the day", href: "timeline.html" },
  { icon: "🎷", title: "Saxophone", note: "Music cues and set list", href: "saxophone.html" }
];

const gate = document.getElementById("gate");
const home = document.getElementById("home");
const who = document.getElementById("who");

function selectedName() {
  if (userSelect.value === "__other") return otherSelect.value;
  return userSelect.value;
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function lockRemaining() {
  const until = Number(sessionStorage.getItem("weddingLockUntil") || 0);
  return Math.max(0, until - Date.now());
}

function showError(message) {
  error.textContent = message;
  error.hidden = false;
}

userSelect.addEventListener("change", () => {
  const isOther = userSelect.value === "__other";
  otherWrap.hidden = !isOther;
  otherSelect.required = isOther;
  if (!isOther) otherSelect.value = "";
  error.hidden = true;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const wait = lockRemaining();
  if (wait > 0) {
    showError("Too many tries. Wait " + Math.ceil(wait / 1000) + " seconds, then try again.");
    return;
  }

  const name = selectedName();
  const hash = await sha256(passwordInput.value);
  passwordInput.value = "";
  const ok = Boolean(name && passwordHashes[name] && passwordHashes[name] === hash);
  if (!ok) {
    const fails = Number(sessionStorage.getItem("weddingFails") || 0) + 1;
    sessionStorage.setItem("weddingFails", String(fails));
    if (fails >= MAX_TRIES) {
      sessionStorage.setItem("weddingLockUntil", String(Date.now() + LOCK_MS));
      sessionStorage.setItem("weddingFails", "0");
      showError("Too many tries. Wait 60 seconds, then try again.");
      return;
    }
    showError("That name and password do not match. Try again.");
    return;
  }

  sessionStorage.removeItem("weddingFails");
  sessionStorage.removeItem("weddingLockUntil");
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
  const list = document.getElementById("sections");
  list.replaceChildren();
  sections.filter((section) => WeddingAccess.can(section.href, name)).forEach((section) => {
    const link = document.createElement("a");
    link.className = "section-link";
    link.href = section.href;
    const copy = document.createElement("span");
    copy.className = "section-copy";
    const title = document.createElement("strong");
    title.textContent = section.title;
    const note = document.createElement("span");
    note.textContent = section.note;
    copy.append(title, note);
    if (name === "Udara") {
      const access = document.createElement("span");
      access.className = "section-who";
      access.textContent = "Open to: " + WeddingAccess.label(section.href);
      copy.append(access);
    }
    link.append(copy);
    const icon = document.createElement("span");
    icon.className = "section-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = section.icon;
    const go = document.createElement("span");
    go.className = "section-go";
    go.setAttribute("aria-hidden", "true");
    go.textContent = "›";
    link.prepend(icon);
    link.append(go);
    list.appendChild(link);
  });
  gate.hidden = true;
  home.hidden = false;
  error.hidden = true;
}

const saved = sessionStorage.getItem("weddingUser");
if (saved && passwordHashes[saved]) showHome(saved);
