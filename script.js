// ====================================================
//                 CORE STATE
// ====================================================
let expr = "";
let isFinal = false;
const OPS = ["+", "-", "*", "/", "%", "^"];
const history = [];

const CalcLogic = window.CalcLogic;

// ====================================================
//                 DOM ELEMENTS
// ====================================================
const exprEl = document.getElementById("expr");
const resultEl = document.getElementById("result");
const historyPanel = document.getElementById("historyPanel");
const overlay = document.getElementById("overlay");
const welcomeOverlay = document.querySelector("#welcomeOverlay");
const startBtn = document.querySelector("#startBtn");

// Menu
const menuBtn = document.getElementById("menuBtn");
const mainMenuPanel = document.getElementById("settingsPanel");
const closeMainMenu = document.getElementById("closeMainMenu");

// Panels
const historyBtn = document.getElementById("historyBtn");
const closeHistory = document.getElementById("closeHistory");
const aboutBtn = document.getElementById("aboutBtn");
const closeAbout = document.getElementById("closeAbout");
const aboutPanel = document.getElementById("aboutPanel");

// Theme
const themeSelect = document.getElementById("theme");
const fontsizeSelect = document.getElementById("fontsize");
const buttonshapeSelect = document.getElementById("buttonshape");

// ====================================================
//                 RENDERING
// ====================================================
function render() {
  try {
    let display = expr;

    display = display
      .replace(/sqrt\(/g, "√(")
      .replace(/\*/g, "×")
      .replace(/\//g, "÷");

    display = display.replace(/\d+(\.\d+)?/g, m =>
      CalcLogic.formatNumber(m)
    );

    exprEl.textContent = display || "0";

    if (!isFinal && expr !== "") {
      try {
        const val = CalcLogic.evaluate(expr);
        resultEl.textContent = CalcLogic.formatNumber(val);
      } catch {
        resultEl.textContent = "";
      }
    }

    if (expr === "") resultEl.textContent = "";

  } catch {
    exprEl.textContent = expr || "0";
    resultEl.textContent = "";
  }
}

// ====================================================
//                 INPUT HANDLING
// ====================================================
function append(v) {
  if (isFinal) {
    expr = "";
    isFinal = false;
  }

  const last = expr.slice(-1);

  if (OPS.includes(v) && OPS.includes(last)) {
    expr = expr.slice(0, -1) + v;
  } else {
    expr += v;
  }

  render();
}

function handleFn(fn) {

  if (fn === "clear") {
    expr = "";
    isFinal = false;
    render();
    return;
  }

  if (fn === "back") {
    expr = expr.slice(0, -1);
    render();
    return;
  }

  if (fn === "paren") {
    const o = (expr.match(/\(/g) || []).length;
    const c = (expr.match(/\)/g) || []).length;
    expr += (o > c ? ")" : "(");
    render();
    return;
  }

  if (["sin", "cos", "tan", "sqrt"].includes(fn)) {
    expr += fn + "(";
    render();
    return;
  }

  if (fn === "equals") {
    try {
      const rawExpr = expr;
      const val = CalcLogic.evaluate(rawExpr);

      if (!isNaN(val)) {
        history.unshift(`${rawExpr} = ${val}`);
        expr = String(val);
      }

      isFinal = true;
      renderHistory();
      render();

      resultEl.classList.add("show");

    } catch (err) {
      resultEl.textContent = "Error";
      console.error(err);
    }
  }
}

// ====================================================
//                 HISTORY
// ====================================================
function renderHistory() {
  historyPanel.innerHTML =
    `<h2>History</h2>` +
    history.map(h => `<div class="hist-item">${h}</div>`).join("");

  document.querySelectorAll(".hist-item").forEach(el => {
    el.onclick = () => {
      expr = el.textContent.split("=")[1].trim();
      isFinal = false;
      render();
      historyPanel.classList.remove("open");
      overlay.classList.remove("active");
    };
  });
}

// ====================================================
//                 PANELS & OVERLAY
// ====================================================
function closeAllPanels() {
  mainMenuPanel.classList.remove("active");
  historyPanel.classList.remove("open");
  aboutPanel.classList.remove("open");
  overlay.classList.remove("active");
}

function openPanel(panel) {
  closeAllPanels();
  panel.classList.add("open");
  overlay.classList.add("active");
}

menuBtn.onclick = (e) => {
  e.stopPropagation();
  closeAllPanels();
  mainMenuPanel.classList.add("active");
  overlay.classList.add("active");
};

// ====================================================
//                 BUTTON EVENTS
// ====================================================
document.querySelectorAll(".keys button").forEach(btn => {
  const value = btn.dataset.value;
  const fn = btn.dataset.fn;
  btn.onclick = () => {
    if (value) append(value);
    if (fn) handleFn(fn);
  };
});

// Welcome overlay
startBtn.onclick = function() {
  welcomeOverlay.classList.toggle("native");
  setTimeout(() => {
    welcomeOverlay.style.zIndex = "-1";
  }, 1000);
};

overlay.onclick = () => {
  closeAllPanels();
};

// menuBtn.onclick = openMainMenu;
closeMainMenu.onclick = closeAllPanels;

historyBtn.onclick = () => openPanel(historyPanel);
closeHistory.onclick = () => {
  closeAllPanels();
  historyPanel.classList.remove("open");
};

aboutBtn.onclick = () => openPanel(aboutPanel);
closeAbout.onclick = () => {
  closeAllPanels();
  aboutPanel.classList.remove("open");
};

// ====================================================
//                 KEYBOARD SUPPORT
// ====================================================
document.addEventListener("keydown", (e) => {
  if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

  const key = e.key;

  if (!isNaN(key)) return append(key);
  if (OPS.includes(key)) return append(key);
  if (key === "." || key === "(" || key === ")") return append(key);

  if (key === "Enter") {
    e.preventDefault();
    return handleFn("equals");
  }

  if (key === "Backspace") return handleFn("back");
  if (key === "Escape") return handleFn("clear");

  if (e.ctrlKey) {
    if (key === "s") append("sin(");
    if (key === "c") append("cos(");
    if (key === "t") append("tan(");
    if (key === "r") append("sqrt(");
  }
});

// ====================================================
//                 THEME & SETTINGS
// ====================================================
function setTheme(themeName) {
  document.body.classList.remove("dark-theme", "light-theme", "blue-cyan-theme");
  document.body.classList.add(`${themeName}-theme`);
  localStorage.setItem("calculatorTheme", themeName);
}

function setFontSize(size) {
  document.documentElement.style.setProperty("--font-size", `${size}px`);
  localStorage.setItem("calculatorFontSize", size);
}

function setButtonShape(shape) {
  document.documentElement.style.setProperty(
    "--button-radius",
    shape === "round" ? "50px" : shape === "square" ? "0" : "10px"
  );
  localStorage.setItem("calculatorButtonShape", shape);
}

function loadSettings() {
  const savedTheme = localStorage.getItem("calculatorTheme") || "blue-cyan";
  const savedFontSize = localStorage.getItem("calculatorFontSize") || "18";
  const savedButtonShape = localStorage.getItem("calculatorButtonShape") || "default";

  setTheme(savedTheme);
  setFontSize(savedFontSize);
  setButtonShape(savedButtonShape);

  themeSelect.value = savedTheme;
  fontsizeSelect.value = savedFontSize;
  buttonshapeSelect.value = savedButtonShape;
}

themeSelect.onchange = e => setTheme(e.target.value);
fontsizeSelect.onchange = e => setFontSize(e.target.value);
buttonshapeSelect.onchange = e => setButtonShape(e.target.value);

// ====================================================
//                 INIT
// ====================================================
loadSettings();
render();
