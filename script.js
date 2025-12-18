// ====================================================
// 📌 ELEMENTS
// ====================================================
const body = document.body;

const overlay = document.getElementById("overlay");
const welcomeOverlay = document.getElementById("welcomeOverlay");

const settingsPanel = document.getElementById("settingsPanel");
const historyPanel = document.getElementById("historyPanel");
const aboutPanel = document.getElementById("aboutPanel");

const menuBtn = document.getElementById("menuBtn");
const closeMainMenu = document.getElementById("closeMainMenu");
const historyBtn = document.getElementById("historyBtn");
const closeHistory = document.getElementById("closeHistory");
const aboutBtn = document.getElementById("aboutBtn");
const closeAbout = document.getElementById("closeAbout");

const startBtn = document.getElementById("startBtn");

const themeSelect = document.getElementById("theme");
const fontSizeSelect = document.getElementById("fontsize");
const buttonShapeSelect = document.getElementById("buttonshape");

// ====================================================
// 🧭 PANEL CONTROL
// ====================================================
function openPanel(panel) {
  panel.classList.add("active");
  overlay.classList.add("show");
}

function closeAllPanels() {
  [settingsPanel, historyPanel, aboutPanel].forEach(p =>
    p.classList.remove("active")
  );
  overlay.classList.remove("show");
}

// ====================================================
// ⚙ SETTINGS PANEL
// ====================================================
menuBtn.onclick = () => openPanel(settingsPanel);
closeMainMenu.onclick = closeAllPanels;

// ====================================================
// 📜 HISTORY PANEL
// ====================================================
historyBtn.onclick = () => openPanel(historyPanel);
closeHistory.onclick = closeAllPanels;

// ====================================================
// 💡 ABOUT PANEL
// ====================================================
aboutBtn.onclick = () => openPanel(aboutPanel);
closeAbout.onclick = closeAllPanels;

// ====================================================
// 🌫 OVERLAY CLICK
// ====================================================
overlay.onclick = closeAllPanels;

// ====================================================
// 🎨 THEME SYSTEM
// ====================================================
themeSelect.onchange = e => {
  body.className = e.target.value + "-theme";
};

// ====================================================
// 🔠 FONT SIZE SYSTEM
// ====================================================
fontSizeSelect.onchange = e => {
  document.documentElement.style.fontSize = e.target.value + "px";
};

// ====================================================
// 🔘 BUTTON SHAPE SYSTEM
// ====================================================
buttonShapeSelect.onchange = e => {
  body.dataset.shape = e.target.value;
};

// ====================================================
// 👋 WELCOME OVERLAY
// ====================================================
startBtn.onclick = () => {
  welcomeOverlay.classList.add("hide");
  setTimeout(() => {
    welcomeOverlay.style.display = "none";
  }, 300);
};
