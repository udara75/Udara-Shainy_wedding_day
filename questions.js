const KEY = "weddingQuestions";
const TOKEN_KEY = "weddingGithubToken";
const REPO = "udara75/Udara-Shainy_wedding_day";
const FILE = "questions.json";
const pendingBox = document.getElementById("pending");
const completedBox = document.getElementById("completed");
const form = document.getElementById("ask-form");
const input = document.getElementById("question");
const tokenForm = document.getElementById("token-form");
const tokenInput = document.getElementById("github-token");
const status = document.getElementById("save-status");

let items = [];
let fileSha = "";

function localItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function remember(next) {
  items = next;
  localStorage.setItem(KEY, JSON.stringify(items));
}

function setStatus(text) {
  status.textContent = text;
}

function emptyNote(text) {
  const note = document.createElement("p");
  note.className = "lead";
  note.textContent = text;
  return note;
}

function render() {
  pendingBox.replaceChildren();
  completedBox.replaceChildren();
  const pending = items.filter((item) => !item.answer);
  const completed = items.filter((item) => item.answer);
  if (!pending.length) pendingBox.appendChild(emptyNote("No pending questions."));
  if (!completed.length) completedBox.appendChild(emptyNote("No completed questions yet."));
  pending.forEach((item) => pendingBox.appendChild(card(item, false)));
  completed.forEach((item) => completedBox.appendChild(card(item, true)));
}

async function readRemote() {
  const response = await fetch("https://raw.githubusercontent.com/" + REPO + "/main/" + FILE + "?t=" + Date.now());
  if (!response.ok) return null;
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

async function publish() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    setStatus("Saved on this browser only. Add a GitHub token to store the list in the repository for Shainy too.");
    return;
  }
  const current = await fetch("https://api.github.com/repos/" + REPO + "/contents/" + FILE, {
    headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" }
  });
  if (current.ok) fileSha = (await current.json()).sha;
  const body = {
    message: "Update wedding questions",
    content: btoa(unescape(encodeURIComponent(JSON.stringify(items, null, 2) + "\n"))),
    branch: "main"
  };
  if (fileSha) body.sha = fileSha;
  const saved = await fetch("https://api.github.com/repos/" + REPO + "/contents/" + FILE, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!saved.ok) {
    setStatus("Could not save to GitHub. Check that the token can edit this repository.");
    return;
  }
  fileSha = (await saved.json()).content.sha;
  setStatus("Saved in the GitHub file. Shainy will see it after the page reloads.");
}

function card(item, done) {
  const block = document.createElement("article");
  block.className = "qa-card";
  const question = document.createElement("p");
  question.className = "qa-q";
  question.textContent = item.question;
  const by = document.createElement("p");
  by.className = "access-hint";
  by.textContent = "Asked by " + item.by;
  block.append(question, by);
  if (done) {
    const answer = document.createElement("p");
    answer.textContent = item.answer;
    const who = document.createElement("p");
    who.className = "access-hint";
    who.textContent = "Answered by " + item.answeredBy;
    block.append(answer, who);
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
  reply.addEventListener("submit", async (event) => {
    event.preventDefault();
    const found = items.find((entry) => entry.id === item.id);
    if (!found) return;
    found.answer = field.value.trim();
    found.answeredBy = sessionStorage.getItem("weddingUser") || "";
    remember(items);
    render();
    await publish();
  });
  block.appendChild(reply);
  return block;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  items.unshift({
    id: Date.now().toString(),
    question: text,
    by: sessionStorage.getItem("weddingUser") || "",
    answer: "",
    answeredBy: ""
  });
  remember(items);
  input.value = "";
  render();
  await publish();
});

tokenForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const token = tokenInput.value.trim();
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
  tokenInput.value = "";
  setStatus("Token saved on this browser. Publishing the current list.");
  await publish();
});

async function start() {
  const local = localItems();
  try {
    const remote = await readRemote();
    const remoteIds = new Set((remote || []).map((item) => item.id));
    const extras = local.filter((item) => !remoteIds.has(item.id));
    items = (remote || []).concat(extras);
  } catch (error) {
    items = local;
  }
  remember(items);
  render();
  if (!localStorage.getItem(TOKEN_KEY)) {
    setStatus("Add a GitHub token once on this browser so new questions are stored in the repository.");
  }
}

start();
