"use strict";

// ================= ELEMENTS =================
const exprEl = document.getElementById("expr");
const resultEl = document.getElementById("result");
const keys = document.querySelector(".keys");

const overlay = document.getElementById("overlay");
const settingsPanel = document.getElementById("settingsPanel");
const historyPanel = document.getElementById("historyPanel");
const aboutPanel = document.getElementById("aboutPanel");
const historyEl = document.getElementById("history");
const welcomeOverlay = document.getElementById("welcomeOverlay");
const startBtn = document.getElementById("startBtn");

// ================= STATE =================
let expression = "";
let history = [];

function formatDisplay(expr) {
  if (!expr) return "0";

  return expr
    .replace(/Math\.sqrt\(/g, "√")
    .replace(/√\(/g, "√")
    .replace(/\*/g, "x")
    .replace(/\//g, ":")
    .replace(/\)/g, ")"); // tanda tutup tidak ditampilkan
}

// ================= DISPLAY =================
function updateDisplay() {
  exprEl.textContent = formatDisplay(expression);

  if (!window.CalcLogic || !expression) {
    resultEl.textContent = "0";
    return;
  }

  let tempExpr = expression;
  const open = (tempExpr.match(/\(/g) || []).length;
  const close = (tempExpr.match(/\)/g) || []).length;
  if (open > close) {
    tempExpr += ")".repeat(open - close);
  }

  const res = window.CalcLogic.evaluate(tempExpr);

  if (Number.isNaN(res)) {
    resultEl.textContent = "Error";
    return;
  }

  resultEl.textContent = res;
}


  // 🧠 AUTO CLOSE KURUNG UNTUK PREVIEW
  let tempExpr = expression;
  const open = (tempExpr.match(/\(/g) || []).length;
  const close = (tempExpr.match(/\)/g) || []).length;
  if (open > close) {
    tempExpr += ")".repeat(open - close);
  }

  const res = window.CalcLogic.evaluate(tempExpr);
  resultEl.textContent = isNaN(res) ? "0" : res;


function canAddOperator(op) {
  if (!expression) return op === "-";

  const last = expression.slice(-1);
  return !/[+\-*/.%]/.test(last);
}

// ================= INPUT =================
function addValue(val) {
  if (/[+\-*/.%]/.test(val)) {
    if (!canAddOperator(val)) return;
  }

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

// ================= CALCULATE =================
function calculate() {
  const res = window.CalcLogic.evaluate(expression);
  if (Number.isNaN(res)) return;

  history.unshift({
    expr: expression,
    result: res
  });

  if (history.length > 20) history.pop();

  renderHistory();
  expression = String(res);
  updateDisplay();
}

// ================= HISTORY =================
function renderHistory() {
  historyEl.innerHTML = history
    .map((h, i) =>
      `<div class="history-item" data-index="${i}">
        ${formatDisplay(h.expr)} = ${h.result}
      </div>`
    )
    .join("");
}
historyEl.addEventListener("click", e => {
  const item = e.target.closest(".history-item");
  if (!item) return;

  const index = item.dataset.index;
  if (index === undefined) return;

  expression = history[index].expr;
  updateDisplay();
});


// ================= BUTTONS =================
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

// ================= KEYBOARD =================
document.addEventListener("keydown", e => {
  const allowed = [
    "0","1","2","3","4","5","6","7","8","9",
    "+","-","*","/","%",".",
    "(",")"
  ];

  const digitCount = (expression.match(/[0-9]/g) || []).length;

  if (/[0-9]/.test(e.key)) {
    if (digitCount >= 27) {
      e.preventDefault();
      return;
    }
    addValue(e.key);
    return;
  }

  if (allowed.includes(e.key)) {
    addValue(e.key);
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    calculate();
    return;
  }

  if (e.key === "Backspace") {
    e.preventDefault();
    backspace();
    return;
  }

  if (e.key === "c") {
    e.preventDefault();
    clearAll();
    return;
  }

  e.preventDefault();
});


// ================= SETTINGS =================
document.getElementById("theme").onchange = e => {
  document.body.className = e.target.value + "-theme";
};

document.getElementById("fontsize").onchange = e => {
  document.documentElement.style.fontSize = e.target.value + "px";
};

document.getElementById("buttonshape").onchange = e => {
  document.body.dataset.shape = e.target.value;
};

// ================= PANELS =================
function closePanels() {
  settingsPanel.classList.remove("active");
  historyPanel.classList.remove("active");
  aboutPanel.classList.remove("active");
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

document.getElementById("closeMainMenu").onclick =
document.getElementById("closeHistory").onclick =
document.getElementById("closeAbout").onclick = closePanels;

overlay.onclick = closePanels;

// ================= WELCOME =================
startBtn.onclick = () => {
  welcomeOverlay.classList.add("hide");
  setTimeout(() => {
    welcomeOverlay.style.display = "none";
  }, 300);
};
// ================= WALLPAPER (STATIC) =================
const wallpaperInput = document.getElementById("wallpaperInput");
const display = document.querySelector(".display");

wallpaperInput.addEventListener("change", () => {
  const file = wallpaperInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    display.style.backgroundImage = `url(${reader.result})`;
    display.style.backgroundSize = "cover";
    display.style.backgroundPosition = "center";
    display.style.backgroundRepeat = "no-repeat";
  };
  reader.readAsDataURL(file);
});


// ================= INIT =================
updateDisplay();
console.log("ModernCalc ready");
