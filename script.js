let expr = "";
let isFinal = false;
const OPS = ["+", "-", "*", "/", "%", "^"];
const history = [];

const exprEl = document.getElementById("expr");
const resultEl = document.getElementById("result");
const historyPanel = document.getElementById("historyPanel");
const overlay = document.getElementById("overlay");
const welcomeOverlay = document.getElementById("welcomeOverlay");
const startBtn = document.getElementById("startBtn");

// Menu elements
const menuBtn = document.getElementById("menuBtn");
const mainMenuPanel = document.querySelector(".main-panel");
const closeMainMenu = document.getElementById("closeMainMenu");

// Panel elements
// const settingsBtn = document.getElementById("settingsBtn");
// const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");
const historyBtn = document.getElementById("historyBtn");
const closeHistory = document.getElementById("closeHistory");
const aboutBtn = document.getElementById("aboutBtn");
const closeAbout = document.getElementById("closeAbout");
const aboutPanel = document.getElementById("aboutPanel");

// Theme elements
const themeSelect = document.getElementById("theme");
const fontsizeSelect = document.getElementById("fontsize");
const buttonshapeSelect = document.getElementById("buttonshape");

const CalcLogic = window.CalcLogic;

function render() {
  try {
    let display = expr;

    // ubah tampilan visual
    display = display.replace(/sqrt\(/g, "√(")
                     .replace(/\*/g, "×")
                     .replace(/\//g, "÷");

    display = display.replace(/\d+(\.\d+)?/g, m => CalcLogic.formatNumber(m));

    exprEl.textContent = display || "0";

    if (!isFinal && expr !== "") {
      const val = CalcLogic.evaluate(expr);
      resultEl.textContent = CalcLogic.formatNumber(val);
    } else if (expr === "") {
      resultEl.textContent = "";
    }

  } catch {
    exprEl.textContent = expr || "0";
    resultEl.textContent = "";
  }
}

function append(v) {
  if (isFinal) {
    expr = "";
    isFinal = false;
  }

  const last = expr.slice(-1);

  if (OPS.includes(v) && OPS.includes(last)) {
    // Replace operator internal (expr)
    expr = expr.slice(0, -1) + v;
  } else {
    expr += v;
  }

  // Force update tampilan operator segera
  if (v === "*") {
    exprEl.textContent = expr.replace(/\*/g, "×");
    return;
  }

  if (v === "/") {
    exprEl.textContent = expr.replace(/\//g, "÷");
    return;
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
      const rawExpr = expr; // simpan ekspresi asli
      const val = CalcLogic.evaluate(rawExpr);

      // simpan ke history (UI) menggunakan ekspresi asli
      if (!isNaN(val)) {
        history.unshift(`${rawExpr} = ${val}`);
        expr = String(val); // expr sekarang hasil murni
      }

      isFinal = true;

      renderHistory();

      // render di delay agar UI tidak overwrite tampilan hasil
      setTimeout(() => {
        render();
        resultEl.classList.add("show");
      }, 10);

    } catch (err) {
      resultEl.textContent = "Error";
      console.error(err);
    }

    return;
  }
}

function renderHistory() {
  historyPanel.innerHTML =
    `<h2>History</h2>` +
    history.map(h => `<div class='hist-item'>${h}</div>`).join("");

  document.querySelectorAll(".hist-item").forEach(el => {
    el.onclick = () => {
      expr = el.textContent.split("=")[1].trim();
      isFinal = false;
      render();
      historyPanel.classList.remove("open");
      overlay.style.display = "none";
    };
  });
}

// Function to close all panels
function closeAllPanels() {
  mainMenuPanel.classList.remove("active");
  // settingsPanel.classList.remove("open");
  // historyPanel.classList.remove("open");
  // aboutPanel.classList.remove("open");
  overlay.classList.remove("active");
}

// Function to open a specific panel
function openPanel(panel) {
  // closeAllPanels();
  panel.classList.add("open");
  overlay.classList.add("active");
}

// Function to open main menu
function openMainMenu() {
  closeAllPanels();
  mainMenuPanel.classList.add("active");
  // menuBtn.classList.add('active');
  overlay.classList.add("active");
}

document.querySelectorAll(".keys button").forEach(btn => {
  const value = btn.dataset.value;
  const fn = btn.dataset.fn;
  btn.onclick = () => {
    if (value) append(value);
    if (fn) handleFn(fn);
  };
});

startBtn.onclick = () => {
  welcomeOverlay.style.display = "none";
};

render();

// Overlay click handler
overlay.onclick = () => {
  closeAllPanels();
};

// Main menu button handlers
menuBtn.onclick = () => {
  openMainMenu();
};

closeMainMenu.onclick = () => {
  closeAllPanels();
};

// Menu option handlers
// settingsBtn.onclick = () => {
//   openPanel(settingsPanel);
// };

closeSettings.onclick = () => {
  closeAllPanels();
};

historyBtn.onclick = () => {
  openPanel(historyPanel);
};

closeHistory.onclick = () => {
  // closeAllPanels();
  historyPanel.classList.remove('open');
};

aboutBtn.onclick = () => {
  openPanel(aboutPanel);
};

closeAbout.onclick = () => {
  // closeAllPanels();
  aboutPanel.classList.remove('open');
};

// ====================================================
//            THEME & SETTINGS FUNCTIONALITY           //
// ====================================================

// --- Theme Switching ---
function setTheme(themeName) {
  // Remove all potential theme classes
  document.body.classList.remove('dark-theme', 'light-theme', 'blue-cyan-theme');
  // Add the new theme class
  document.body.classList.add(`${themeName}-theme`);
  // Save the user's choice in localStorage
  localStorage.setItem('calculatorTheme', themeName);
}

// --- Font Size Switching ---
function setFontSize(size) {
  document.documentElement.style.setProperty('--font-size', `${size}px`);
  localStorage.setItem('calculatorFontSize', size);
}

// --- Button Shape Switching ---
function setButtonShape(shape) {
  document.documentElement.style.setProperty('--button-radius', 
    shape === 'round' ? '50px' : 
    shape === 'square' ? '0' : 
    '10px' // default
  );
  localStorage.setItem('calculatorButtonShape', shape);
}

// --- Load saved settings on page load ---
function loadSettings() {
  // Load Theme
  const savedTheme = localStorage.getItem('calculatorTheme') || 'blue-cyan'; // Default to blue-cyan
  setTheme(savedTheme);
  themeSelect.value = savedTheme;

  // Load Font Size
  const savedFontSize = localStorage.getItem('calculatorFontSize') || '18'; // Default to 18px
  setFontSize(savedFontSize);
  fontsizeSelect.value = savedFontSize;

  // Load Button Shape
  const savedButtonShape = localStorage.getItem('calculatorButtonShape') || 'default'; // Default to default
  setButtonShape(savedButtonShape);
  buttonshapeSelect.value = savedButtonShape;
}

// --- Event Listeners for Settings ---
themeSelect.addEventListener('change', (e) => {
  setTheme(e.target.value);
});

fontsizeSelect.addEventListener('change', (e) => {
  setFontSize(e.target.value);
});

buttonshapeSelect.addEventListener('change', (e) => {
  setButtonShape(e.target.value);
});

// --- Initial call to load settings when the script runs ---
loadSettings();