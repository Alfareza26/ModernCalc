// ================================================================
// 🧠 CALCULATION LOGIC
// ================================================================
window.CalcLogic = {
  evaluate(rawExpr) {
    if (!rawExpr || rawExpr.trim() === "") return NaN;

    let expr = rawExpr;

    // Trigonometri (degree → radian)
    expr = expr.replace(/sin\(([^)]+)\)/g, "Math.sin(($1) * Math.PI / 180)");
    expr = expr.replace(/cos\(([^)]+)\)/g, "Math.cos(($1) * Math.PI / 180)");
    expr = expr.replace(/tan\(([^)]+)\)/g, "Math.tan(($1) * Math.PI / 180)");

    // Akar (√9)
    expr = expr.replace(/√(\d+(\.\d+)?)/g, "Math.sqrt($1)");

    // Pangkat
    expr = expr.replace(/\^/g, "**");

    // Persen
    expr = expr.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

    const result = Function('"use strict"; return (' + expr + ')')();
    return this.round(result);
  },

  formatNumber(num) {
    if (num === "" || num === null || isNaN(num)) return num;
    const [a, b] = num.toString().split(".");
    const i = a.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return b ? `${i},${b}` : i;
  },

  round(num, decimals = 10) {
    if (!isFinite(num)) return NaN;
    const f = Math.pow(10, decimals);
    return Math.round(num * f) / f;
  }
};

// ================================================================
// 🖥️ UI STATE
// ================================================================
let currentInput = "";
let isFinal = false;
const exprEl = document.getElementById("expr");
const resultEl = document.getElementById("result");

exprEl.textContent = "0";
resultEl.textContent = "0";

// ================================================================
// 🎯 UI FUNCTIONS
// ================================================================
function updateExpr() {
  exprEl.textContent = currentInput || "0";
}

function updateResult(v) {
  resultEl.textContent = CalcLogic.formatNumber(v);
}
function isPreviewSafe(expr) {
  if (!expr) return false;
  if (/^[+\-*/^.]$/.test(expr)) return false;
  if (/[+\-*/^.]$/.test(expr)) return false;
  if (/√$/.test(expr)) return false;
  if (/(sin|cos|tan)\($/.test(expr)) return false;
  return true;
}

function previewResult() {
  if (!isPreviewSafe(currentInput)) {
    resultEl.textContent = "0";
    resultEl.classList.remove("final");
    return;
  }

  try {
    const r = CalcLogic.evaluate(currentInput);
    if (!isFinite(r)) return;

    resultEl.textContent = CalcLogic.formatNumber(r);
    resultEl.classList.remove("final");

  } catch {
    resultEl.textContent = "0";
  }
}


function appendValue(v) {
  if (isFinal && /[0-9.]/.test(v)) {
    currentInput = "";
  }

  isFinal = false;
  currentInput += v;

  updateExpr();
  previewResult();
}


function deleteLast() {
  isFinal = false;
  currentInput = currentInput.slice(0, -1);
  updateExpr();
  previewResult();
}

function clearAll() {
  currentInput = "";
  isFinal = false;
  exprEl.textContent = "0";
  resultEl.textContent = "0";
  resultEl.classList.remove("final");
}

// ================================================================
// ✅ VALIDATION
// ================================================================
function isExpressionValid(expr) {
  if (!expr) return false;
  if (/[+\-*/^.]$/.test(expr)) return false;
  if (/√$/.test(expr)) return false;

  const o = (expr.match(/\(/g)||[]).length;
  const c = (expr.match(/\)/g)||[]).length;
  if (o !== c) return false;

  return true;
}

// ================================================================
// 🧮 CALCULATE
// ================================================================
function calculate() {
  if (!isExpressionValid(currentInput)) {
    resultEl.textContent = "Error";
    return;
  }

  try {
    const r = CalcLogic.evaluate(currentInput);
    if (!isFinite(r)) throw 0;

    resultEl.textContent = CalcLogic.formatNumber(r);
    resultEl.classList.add("final");

    currentInput = r.toString();
    updateExpr();
    isFinal = true;

  } catch {
    resultEl.textContent = "Error";
  }
}




// ================================================================
// 🧩 BUTTON CLICK HANDLER
// ================================================================
document.querySelectorAll(".keys button").forEach(btn=>{
  btn.onclick=()=>{
    const v = btn.dataset.value;
    const f = btn.dataset.fn;

    if (v) return appendValue(v);

    if (f==="sin") appendValue("sin(");
    if (f==="cos") appendValue("cos(");
    if (f==="tan") appendValue("tan(");
    if (f==="sqrt") appendValue("√");
    if (f==="paren") appendValue("(");
    if (f==="back") deleteLast();
    if (f==="clear") clearAll();
    if (f==="equals") calculate();
  };
});

// ================================================================
// ⌨️ KEYBOARD SUPPORT (FULL + NUMPAD)
// ================================================================
document.addEventListener("keydown",e=>{
  if (e.repeat) return;
  if (["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) return;

  const k=e.key,c=e.code;

  if (k==="Enter") {
    e.preventDefault();
    calculate();
    return;
  }

  if (c.startsWith("Numpad") && !isNaN(k)) return appendValue(k);
  if (["+","-","*","/","^","."].includes(k)) return appendValue(k);
  if (!isNaN(k)) return appendValue(k);

  if (k==="Backspace") return deleteLast();
  if (k==="Escape") return clearAll();

  if (e.ctrlKey) {
    if (k==="s") appendValue("sin(");
    if (k==="c") appendValue("cos(");
    if (k==="t") appendValue("tan(");
    if (k==="r") appendValue("√");
  }
});

// ================================================================
// 🎬 WELCOME OVERLAY
// ================================================================
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const welcomeOverlay = document.getElementById("welcomeOverlay");

  if (!startBtn || !welcomeOverlay) return;

  startBtn.onclick = () => {
    welcomeOverlay.classList.add("native");
    setTimeout(() => {
      welcomeOverlay.style.zIndex = "-1";
      welcomeOverlay.style.pointerEvents = "none";
    }, 1000);
  };
});
