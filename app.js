const passwordHashes = {
  Udara: "047056da58ae7a13b37bb694535acbf73e4e37186ced1202d89fa13868db8fbd",
  Shainy: "3e390ad351c50fac35489b8860216bc12c3f831f5196bcc271dc05417c97d436",
  Grandeezza: "1e2c05d93ba5d4e27a0be1d70bd224462af31d15e95d1f9cc652922a315575ef",
  VMASTER: "4508c6e57c19468c98c8d9a1e8af29bd34837fc34dafaf8b60998aad1f79fcdb",
  "Senuri-Deco": "42431d61eb83fcc070a4375e39d3615754d51e18ff3483c329b87c4664cde0b3",
  "WIFI music": "136d87fd039467663c1dfe36747ea036a50e5abbe795d72fef387d1b3209f49d",
  Naveen: "bf8beb25f9cbd2f94e7d197eb1d0191a7fc0d5b20731ac87280bd28d8853e248",
  Roshen: "4bb752e8cbdcc2140c286d67a90a86ec3920e69e09bb6a983c8aed8fa91e9434",
  Sewwandi: "74e299becc80b77ac902aaef9444b3f702eced4278a5d5b9958fad3bcd944368",
  Shehan: "a91c3547a3a3b5143fbc8fe1ec8b6845e9f2f3dbbe9025223a55517265cd94eb",
  Sandani: "aeb0159a1775e83db31fd835f742fc95c663435eaf150006793faf8e90fbd689",
  Dilki: "f17cbf11351b6d08d5f5a7511a88178cf680e0738578e667cc55339c03571a8e",
  Udari: "0011370a9d88abeeedb694fdb9365372ec3e3d737fa735fc46e2d404ce99eb5e",
  Shashik: "13b0361919720067f905846e89e2af7cda6b233d523c82a200c189ac058d8470",
  Samith: "f63c17fc8adf69ee651183239a0c24e670a3ce498ee8ecb599dad037958ee79f",
  Ruchira: "5636fdae1fce8ce88cd5db7e9d5ba7b9ff7841384f34550dfcd82d0b9ccac2a2",
  Ruwan: "14e87dee8704778b2d3c16f3153de7f9a67a81f06b0f763098bf8eb93bdab98e",
  Sanda: "9f011fb6437dc452b01ebf5ef3d6dc3f4766dfe96e7d1edb0c1ab8333d212cc9",
  Dulitha: "bc779584b45e9c69d796eed28fd1a64e34b628e4b2d321692f381b060f4652bf"
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
  { icon: "🎷", title: "Saxophone", note: "Music cues and set list", href: "saxophone.html" },
  { icon: "🎵", title: "Band", note: "Saxophone and the event timeline", href: "band.html" },
  { icon: "❓", title: "Questions", note: "Ask, answer, and mark complete", href: "questions.html" }
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
