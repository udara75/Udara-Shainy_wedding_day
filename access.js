const WeddingAccess = (() => {
  const people = [
    "Udara", "Shainy", "Grandeezza", "VMASTER", "Senuri-Deco", "WIFI music",
    "Naveen", "Roshen", "Sewwandi", "Shehan", "Sandani", "Dilki", "Udari",
    "Shashik", "Samith", "Ruchira", "Ruwan", "Sanda", "Dulitha"
  ];

  const everyone = people.slice();
  const defaults = {
    "decorations.html": everyone,
    "guests.html": ["Udara", "Shainy", "Grandeezza"],
    "menu.html": ["Udara", "Shainy", "Grandeezza", "Roshen", "Shehan", "Shashik"],
    "timeline.html": everyone,
    "saxophone.html": ["Udara", "Shainy", "Naveen", "Ruwan", "Grandeezza", "WIFI music"],
    "questions.html": ["Udara", "Shainy"],
    "band.html": ["Udara", "Shainy", "Naveen", "Ruwan", "Grandeezza", "WIFI music"]
  };

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem("weddingAccess") || "null");
      if (saved && typeof saved === "object") return saved;
    } catch (error) {
      /* keep the built-in list */
    }
    return null;
  }

  function allowed(file) {
    const saved = load();
    const list = (saved && saved[file]) || defaults[file] || [];
    return list.includes("Udara") ? list.slice() : ["Udara"].concat(list);
  }

  function can(file, name) {
    return Boolean(name) && allowed(file).includes(name);
  }

  function label(file) {
    const list = allowed(file);
    if (people.every((person) => list.includes(person))) return "Everyone";
    return list.join(", ");
  }

  function mount(file) {
    if (sessionStorage.getItem("weddingUser") !== "Udara") return;
    const main = document.querySelector("main");
    if (!main || document.getElementById("access-box")) return;

    const box = document.createElement("section");
    box.id = "access-box";
    box.className = "access-box";

    const title = document.createElement("p");
    title.className = "kicker";
    title.textContent = "Who can open this page";
    box.appendChild(title);

    const current = document.createElement("p");
    current.className = "access-now";
    current.textContent = label(file);
    box.appendChild(current);

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "quiet";
    edit.textContent = "Edit access";
    box.appendChild(edit);

    const form = document.createElement("form");
    form.hidden = true;
    people.forEach((person) => {
      const row = document.createElement("label");
      row.className = "access-person";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = person;
      input.checked = allowed(file).includes(person);
      input.disabled = person === "Udara";
      row.appendChild(input);
      row.appendChild(document.createTextNode(person));
      form.appendChild(row);
    });

    const save = document.createElement("button");
    save.type = "submit";
    save.textContent = "Save access";
    form.appendChild(save);

    const hint = document.createElement("p");
    hint.className = "access-hint";
    hint.textContent = "Saved in this browser. Sign in as Udara on each phone if that phone should use the new list.";
    form.appendChild(hint);
    box.appendChild(form);

    edit.addEventListener("click", () => {
      form.hidden = false;
      edit.hidden = true;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const names = [...form.querySelectorAll("input:checked")].map((input) => input.value);
      const saved = load() || {};
      saved[file] = names.includes("Udara") ? names : ["Udara"].concat(names);
      localStorage.setItem("weddingAccess", JSON.stringify(saved));
      current.textContent = label(file);
      form.hidden = true;
      edit.hidden = false;
    });

    const back = main.querySelector(".back");
    if (back) back.insertAdjacentElement("afterend", box);
    else main.prepend(box);
  }

  return { can, label, mount };
})();
