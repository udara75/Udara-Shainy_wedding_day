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
      "Mr Ashan Thirimanne",
      "Mrs Nadeeshani Samarasighe",
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
      "Mr Thimira Keerthisena",
      "Mrs Prasadi Nirmada",
      "Mr Malith Mavinda",
      "Mr Dhanuka Sankalpa",
      "Mr Santhush Kariyawasam",
      "Mr Aruna Edirimanne",
      "Mr Hasitha Madushan",
      "Mr Lakshitha Konara"
    ]
  },
  "05": { people: [] },
  "06": {
    people: [
      "Mrs Neel Rohanakumara",
      "Mrs Indrani Rathnayaka",
      "Mr Dulitha Premathilaka",
      "Mrs Nelna Sugandi",
      "Mr Samith Deshan",
      "Mr H. D. Dharamasena",
      "Mrs Sumithra Damayanthi",
      "Mrs Neluka Paris",
      "Miss Sandani Dilhara",
      "Miss Dilmi Yasara",
      "Miss Dilki Nimhara",
      "Mr Milton Paris"
    ]
  },
  "07": {
    people: [
      "Mr L.D. Karunadasa",
      "Mrs Leela Athuraliya",
      "Mr Shashik Dushmantha",
      "Mrs Udari Sankalpani",
      "Mr Premathilakada Silva",
      "Mrs Jayanthi Mallika",
      "Mr Shan Umantha",
      "Miss Janakshi Hasanjana",
      "Mr J. Rubasinghe",
      "Mrs D. Wickramarachchi",
      "Mrs Nadeeka Saruwabandara",
      "Miss Jayanthi Edirisooriya"
    ]
  },
  "08": {
    people: [
      "Mr Ruchira Maduranga",
      "Mr Kapila Indrajith",
      "Mr Sirantha Vass",
      "Mrs Darshika Nilochani",
      "Mrs L.D. Somawathi",
      "Miss Maneesha Sivaneththi",
      "Miss Mary Athuraliya",
      "Mr Amila",
      "Mr W. Sudarman",
      "Mr W. Poojitha",
      "Mr Manjula Prabath",
      "Mrs Weranga Kaweesha"
    ]
  },
  "09": { people: [] },
  "10": { people: [] },
  "11": { people: [] },
  "12": {
    people: [
      "Mr Laxman Roy",
      "Mrs Rochana Perera",
      "Mr Shehan Harshana",
      "Mrs Sadareka Prasadini",
      "Mr Roshen Shalinka",
      "Mrs Sewwandi Rohanakumara",
      "Mr Susith Rodrigo",
      "Mrs Anne Pushpa",
      "Mr Bandu Aberathne",
      "Mrs Samanthi Priyangika",
      "Miss Hiruni Shehara",
      "Miss Nethmi Himasha"
    ]
  },
  "13": {
    people: [
      "Mr Ruwan Nandana",
      "Mrs Upeksha Sewmini",
      "Mr Chalindu Sankalpa",
      "Mrs Udanie Prarthana",
      "Mr Lahiru Chamara",
      "Mr Madawa Dilshan",
      "Mr Naveen Wickremasinghe",
      "Mrs Chanuri Saneesha",
      "Mrs Udari Pabodhini",
      "Miss Sapna Gamage"
    ]
  },
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
  guestList.querySelectorAll(".guest-card").forEach((card) => {
    card.classList.toggle("is-on", card.dataset.table === table);
  });
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
  guestList.querySelectorAll(".guest-card").forEach((card) => {
    card.classList.toggle("is-on", card.dataset.table === person.table);
  });
}

document.querySelectorAll("[data-table]").forEach((button) => {
  button.addEventListener("click", () => showTable(button.dataset.table));
});

const assignedTables = Object.entries(seating).filter(([, seat]) => seat.people.length);
if (assignedTables.length) {
  guestEmpty.hidden = true;
  assignedTables.sort((a, b) => Number(a[0] === "Head" ? 99 : a[0]) - Number(b[0] === "Head" ? 99 : b[0]));
  assignedTables.forEach(([table, seat]) => {
    const block = document.createElement("button");
    block.type = "button";
    block.className = "guest-card";
    block.dataset.table = table;

    const title = document.createElement("strong");
    title.textContent = (table === "Head" ? "Head table" : "Table " + table) + (seat.group ? " · " + seat.group : "");
    block.appendChild(title);

    const names = document.createElement("ol");
    seat.people.forEach((name) => {
      const item = document.createElement("li");
      item.textContent = name;
      names.appendChild(item);
    });
    block.appendChild(names);

    block.addEventListener("click", () => showTable(table));
    guestList.appendChild(block);
  });
}
