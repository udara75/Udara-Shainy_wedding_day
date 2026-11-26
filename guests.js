const seating = {
  "01": { people: [] },
  "02": {
    group: "University of Peradeniya",
    people: [
      "Mr Kasun Sandakelum",
      "Mr Kasun Madushan",
      "Mr Ashan Sampath",
      "Mr Isuru Jayashankha",
      "Mr Gihantha Wijesekara",
      "Mr Lasindu Nisalka",
      "Mr Sudeep Madubhashitha",
      "Mr Dulshan Dhananjaya",
      "Mr Hashara Piyumal",
      "Mr Sadeep Shayamal",
      "Mr Hasara Jayanath",
      "Mr Sameera Dhananjaya"
    ]
  },
  "03": {
    group: "Synopsys",
    people: [
      "Mr Aditha Rajakaruna",
      "Mr Lakshitha Madushan",
      "Mr & Mrs Ashan Thirimanne",
      "Mr Thimila Ranaweera",
      "Mr Kaushan Ranasinghe",
      "Miss Manodya Deemanthi",
      "Mr Vetharaniam Kathircamalan",
      "Mr Ashan Serasinghe",
      "Mr Supun C Dassanayake",
      "Mr Ravindu Harshana",
      "Mr Rishan Rasdeen"
    ]
  },
  "04": {
    group: "Synopsys",
    people: [
      "Mr Tharinda Uthpala",
      "Mr Dilan Nissanka",
      "Mr Amila Kasun",
      "Mr Sahan Peiris",
      "Mr & Mrs Thimira Keerthisena",
      "Mr Malith Mavinda",
      "Mr Dhanuka Sankalpa",
      "Mr Santhush Kariyawasam",
      "Mr Aruna Edirimanne",
      "Mr Hasitha Madushan",
      "Mr Lakshitha Konara"
    ]
  },
  "05": { people: [] },
  "06": { people: [] },
  "07": { people: [] },
  "08": { people: [] },
  "09": { people: [] },
  "10": { people: [] },
  "11": { people: [] },
  "12": { people: [] },
  "13": { people: [] },
  "14": { people: [] },
  "15": { people: [] },
  "16": { people: [] },
  "17": { people: [] },
  "18": { people: [] },
  Head: { people: [] }
};

const detail = document.getElementById("seat-detail");
const guestList = document.getElementById("guest-list");
const guestEmpty = document.getElementById("guest-empty");

function people() {
  return Object.entries(seating).flatMap(([table, seat]) =>
    seat.people.map((name) => ({ name, table, group: seat.group || "" }))
  );
}

function clearMarks() {
  document.querySelectorAll(".tbl, .seat").forEach((button) => button.classList.remove("is-on"));
}

function mark(table) {
  clearMarks();
  const button = document.querySelector('[data-table="' + table + '"]');
  if (!button) return;
  button.classList.add("is-on");
  button.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function showTable(table) {
  mark(table);
  const seat = seating[table] || { people: [] };
  const names = seat.people;
  const title = table === "Head" ? "Head table" : "Table " + table;
  detail.innerHTML = "";
  const heading = document.createElement("h2");
  heading.textContent = title;
  detail.appendChild(heading);
  if (seat.group) {
    const group = document.createElement("p");
    group.className = "kicker";
    group.textContent = seat.group;
    detail.appendChild(group);
  }
  if (!names.length) {
    const note = document.createElement("p");
    note.className = "lead";
    note.textContent = "No guests have been added to this table yet.";
    detail.appendChild(note);
    return;
  }
  const list = document.createElement("ul");
  list.className = "facts";
  names.forEach((name) => {
    const item = document.createElement("li");
    item.textContent = name;
    list.appendChild(item);
  });
  detail.appendChild(list);
}

function showPerson(person) {
  mark(person.table);
  detail.innerHTML = "";
  const heading = document.createElement("h2");
  heading.textContent = person.name;
  const place = document.createElement("p");
  place.className = "lead";
  const where = person.table === "Head" ? "Head table, beside the setty" : "Table " + person.table;
  place.textContent = person.group ? where + ", " + person.group + "." : where + ".";
  detail.append(heading, place);
  guestList.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-on", button.dataset.name === person.name);
  });
}

document.querySelectorAll("[data-table]").forEach((button) => {
  button.addEventListener("click", () => showTable(button.dataset.table));
});

const assigned = people();
if (assigned.length) {
  guestEmpty.hidden = true;
  assigned.sort((a, b) => a.name.localeCompare(b.name)).forEach((person) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "guest-chip";
    button.dataset.name = person.name;
    button.textContent = person.name;
    button.addEventListener("click", () => showPerson(person));
    guestList.appendChild(button);
  });
}
