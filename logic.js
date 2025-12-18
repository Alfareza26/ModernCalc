// ====================================================
// 🧠 CALCULATION LOGIC (SAFE EVAL)
// ====================================================
const CalcLogic = {
  evaluate(rawExpr) {
    if (!rawExpr) return NaN;

    let expr = rawExpr;

    expr = expr.replace(/√/g, "Math.sqrt");
    expr = expr.replace(/sin\(([^()]+)\)/g, "Math.sin(($1)*Math.PI/180)");
    expr = expr.replace(/cos\(([^()]+)\)/g, "Math.cos(($1)*Math.PI/180)");
    expr = expr.replace(/tan\(([^()]+)\)/g, "Math.tan(($1)*Math.PI/180)");
    expr = expr.replace(/\^/g, "**");
    expr = expr.replace(/%/g, "/100");

    try {
      return Function(`"use strict"; return (${expr})`)();
    } catch {
      return NaN;
    }
  }
};

// ====================================================
// 📌 ELEMENTS
// ====================================================
const exprEl = document.getElementById("expr");
const resultEl = document.getElementById("result");
const keys = document.querySelector(".keys");

const overlay = document.getElementById("overlay");
const settingsPanel = document.getElementById("settingsPanel");
const historyPanel = document.getElementById("historyPanel");
const aboutPanel = document.getElementById("aboutPanel");
const historyEl = document.getElementById("history");
const welcomeOverlay = document.getElementById("welcomeOverlay");

// ====================================================
// 📦 STATE
// ====================================================
let expression = "";
let history = [];

// ====================================================
// 🖥️ DISPLAY
// ====================================================
function updateDisplay() {
  exprEl.textContent = expression || "0";
  const res = CalcLogic.evaluate(expression);
  resultEl.textContent = isNaN(res) ? "0" : res;
}

// ====================================================
// ✏️ INPUT HANDLERS
// ====================================================
function addValue(val) {
  expression += val;
  updateDisplay();
}

function clearAll() {
  expression = "";
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function addParen() {
  const open = (expression.match(/\(/g) || []).length;
  const close = (expression.match(/\)/g) || []).length;
  expression += open > close ? ")" : "(";
  updateDisplay();
}

function addFn(fn) {
  expression += fn + "(";
  updateDisplay();
}

// ====================================================
// 🟰 CALCULATE & HISTORY
// ====================================================
function calculate() {
  const res = CalcLogic.evaluate(expression);
  if (isNaN(res)) return;

  history.unshift(`${expression} = ${res}`);
  if (history.length > 20) history.pop();

  renderHistory();
  expression = String(res);
  updateDisplay();
}

function renderHistory() {
  historyEl.innerHTML = history
    .map(item => `<div class="history-item">${item}</div>`)
    .join("");
}

// ====================================================
// 🧩 BUTTON EVENTS
// ====================================================
keys.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const val = btn.dataset.value;
  const fn = btn.dataset.fn;

  if (val) addValue(val);
  else if (fn === "clear") clearAll();
  else if (fn === "back") backspace();
  else if (fn === "equals") calculate();
  else if (fn === "paren") addParen();
  else if (fn === "sqrt") addValue("√(");
  else if (["sin", "cos", "tan"].includes(fn)) addFn(fn);
});

// ====================================================
// ⌨️ KEYBOARD SUPPORT
// ====================================================
document.addEventListener("keydown", e => {
  if (/[0-9+\-*/.%]/.test(e.key)) addValue(e.key);
  if (e.key === "Enter") calculate();
  if (e.key === "Backspace") backspace();
  if (e.key === "Escape") clearAll();
  if (e.key === "(" || e.key === ")") addValue(e.key);
});

// ====================================================
// 🎨 SETTINGS
// ====================================================
document.getElementById("theme").addEventListener("change", e => {
  document.body.className = e.target.value + "-theme";
});

document.getElementById("fontsize").addEventListener("change", e => {
  document.documentElement.style.fontSize = e.target.value + "px";
});

document.getElementById("buttonshape").addEventListener("change", e => {
  document.body.dataset.shape = e.target.value;
});

// ====================================================
// 📂 PANELS
// ====================================================
function closePanels() {
  [settingsPanel, historyPanel, aboutPanel].forEach(p =>
    p.classList.remove("active")
  );
  overlay.classList.remove("show");
}

document.getElementById("menuBtn").onclick = () => {
  settingsPanel.classList.add("active");
  overlay.classList.add("show");
};

document.getElementById("historyBtn").onclick = () => {
  historyPanel.classList.add("active");
  overlay.classList.add("show");
};

document.getElementById("aboutBtn").onclick = () => {
  aboutPanel.classList.add("active");
  overlay.classList.add("show");
};

document.getElementById("closeMainMenu").onclick = closePanels;
document.getElementById("closeHistory").onclick = closePanels;
document.getElementById("closeAbout").onclick = closePanels;
overlay.onclick = closePanels;

// ====================================================
// 👋 WELCOME OVERLAY
// ====================================================
document.getElementById("startBtn").onclick = () => {
  welcomeOverlay.style.display = "none";
};

// ====================================================
// 🚀 INIT
// ====================================================
updateDisplay();
