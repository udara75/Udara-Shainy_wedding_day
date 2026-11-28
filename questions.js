const KEY = "weddingQuestions";
const pendingBox = document.getElementById("pending");
const completedBox = document.getElementById("completed");
const form = document.getElementById("ask-form");
const input = document.getElementById("question");

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

function emptyNote(text) {
  const note = document.createElement("p");
  note.className = "lead";
  note.textContent = text;
  return note;
}

function render() {
  const items = load();
  pendingBox.replaceChildren();
  completedBox.replaceChildren();
  const pending = items.filter((item) => !item.answer);
  const completed = items.filter((item) => item.answer);

  if (!pending.length) pendingBox.appendChild(emptyNote("No pending questions."));
  if (!completed.length) completedBox.appendChild(emptyNote("No completed questions yet."));

  pending.forEach((item) => pendingBox.appendChild(card(item, false)));
  completed.forEach((item) => completedBox.appendChild(card(item, true)));
}

function card(item, done) {
  const block = document.createElement("article");
  block.className = "qa-card";

  const question = document.createElement("p");
  question.className = "qa-q";
  question.textContent = item.question;
  block.appendChild(question);

  const by = document.createElement("p");
  by.className = "access-hint";
  by.textContent = "Asked by " + item.by;
  block.appendChild(by);

  if (done) {
    const answer = document.createElement("p");
    answer.textContent = item.answer;
    block.appendChild(answer);
    const who = document.createElement("p");
    who.className = "access-hint";
    who.textContent = "Answered by " + item.answeredBy;
    block.appendChild(who);
    return block;
  }

  const reply = document.createElement("form");
  const field = document.createElement("textarea");
  field.rows = 2;
  field.required = true;
  field.placeholder = "Write the answer";
  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Save answer";
  reply.append(field, button);
  reply.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = load();
    const found = items.find((entry) => entry.id === item.id);
    if (!found) return;
    found.answer = field.value.trim();
    found.answeredBy = sessionStorage.getItem("weddingUser") || "";
    save(items);
    render();
  });
  block.appendChild(reply);
  return block;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const items = load();
  items.unshift({
    id: Date.now().toString(),
    question: text,
    by: sessionStorage.getItem("weddingUser") || "",
    answer: "",
    answeredBy: ""
  });
  save(items);
  input.value = "";
  render();
});

render();
