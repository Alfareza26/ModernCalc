(function () {
  const exprEl = document.getElementById("expr");
  const resultEl = document.getElementById("result");
  const historyEl = document.getElementById("history");
  const welcomeOverlay = document.getElementById("welcomeOverlay");
  const startBtn = document.getElementById("startBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsPanel = document.getElementById("settingsPanel");
  const overlay = document.getElementById("overlay");
  const closeSettings = document.getElementById("closeSettings");
  const themeSel = document.getElementById("theme");
  const fontSel = document.getElementById("fontsize");
  const buttonShape = document.getElementById("buttonshape");

  let expr = "";
  let isFinal = false;
  const history = [];
  const OPS = ["+", "-", "*", "/", "%", "^"];

  startBtn.onclick = () => {
    welcomeOverlay.classList.remove("show");
    welcomeOverlay.style.display = "none";
  };

  window.addEventListener("keydown", (e) => {
    if (e.code === "Enter" && welcomeOverlay.classList.contains("show")) {
      e.preventDefault();
      startBtn.click();
    }
  });

  settingsBtn.onclick = () => {
    settingsPanel.classList.add("open");
    overlay.style.display = "block";
  };
  closeSettings.onclick = overlay.onclick = () => {
    settingsPanel.classList.remove("open");
    overlay.style.display = "none";
  };

  function formatNumber(num) {
    if (num === "" || isNaN(num)) return num;
    const clean = num.toString().replace(/\./g, "");
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function render() {
    try {      
      const formattedExpr = expr.replace(/\d+(\.\d+)?/g, match => formatNumber(match));
      exprEl.textContent = formattedExpr || "0";

      if (!isFinal) {
        const val = evalPercent(expr);
        resultEl.textContent = isNaN(val) ? "0" : formatNumber(val);
      }
    } catch {
      exprEl.textContent = expr || "0";
      resultEl.textContent = "0";
    }
  }

  function evalPercent(expression) {
    let expr = expression;
    expr = expr.replace(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)%/g, (_, num1, op, num2) => {
      num1 = parseFloat(num1);
      num2 = parseFloat(num2);
      switch (op) {
        case "+":
        case "-":
          return `${num1}${op}${(num1 * num2) / 100}`;
        case "*":
          return `${num1}*(${num2}/100)`;
        case "/":
          return `${num1}/(${num2}/100)`;
        default:
          return _;
      }
    });
    expr = expr.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
    return Function('"use strict";return(' + expr + ")")();
  }

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
    resultEl.classList.remove("show");
    render();
  }

  function handleFn(f) {
  if (f === "clear") {
    expr = "";
    isFinal = false;
    currentResult = null;
    resultEl.classList.remove("show");
    render();
    return;
  }
  if (f === "back") {
    expr = expr.slice(0, -1);
    render();
    return;
  }
  if (f === "paren") {
    const o = (expr.match(/\(/g) || []).length;
    const c = (expr.match(/\)/g) || []).length;
    expr += o > c ? ")" : "(";
    render();
    return;
  }
  if (f === "equals") {
    try {
    const val = evalPercent(expr);
    history.unshift(expr + " = " + val);
    expr = String(val);
    isFinal = true;
    renderHistory();
    render();

    resultEl.classList.remove("show");
    void resultEl.offsetWidth;
    resultEl.classList.add("show");
  } catch {
    resultEl.textContent = "Not Found";
   }
  }
}
  function renderHistory() {
    historyEl.innerHTML = history
      .map((h) => `<div class="hist-item">${h}</div>`)
      .join("");

    document.querySelectorAll(".hist-item").forEach((el) => {
      el.onclick = () => {
        const val = el.textContent.split(" = ")[1].replace(/\./g, "");
        expr = val;
        isFinal = false;
        render();
      };
    });
  }

  document.querySelectorAll(".keys button").forEach((b) => {
    b.onclick = () =>
      b.dataset.value ? append(b.dataset.value) : handleFn(b.dataset.fn);
  });

  window.onkeydown = (e) => {
    if (e.key === "Enter") return handleFn("equals");
    if (e.key === "Backspace") return handleFn("back");
    if (e.key.toLowerCase() === "c") return handleFn("clear");
    if (/^[0-9+\-*/%^().]$/.test(e.key)) return append(e.key);
  };

  window.addEventListener("keydown", (e) => {
    if (e.key === "d") {
      history.length = 0;
      renderHistory();
    }
    if (e.ctrlKey && e.key.toLowerCase() === "m") {
      historyEl.style.display =
        historyEl.style.display === "none" ? "block" : "none";
    }
  });

  themeSel.onchange = (e) => {
    const v = e.target.value;
    document.body.classList.remove("light-theme", "dark-theme");
    if (v === "light") {
      document.body.classList.add("light-theme");
    } else if (v === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.removeAttribute("class");
    }
  };

  fontSel.oninput = (e) =>
    document.documentElement.style.setProperty(
      "--font-size",
      e.target.value + "px"
    );

  buttonShape.onchange = (e) => {
    const v = e.target.value;
    if (v === "round")
      document.documentElement.style.setProperty("--button-radius", "50%");
    else if (v === "square")
      document.documentElement.style.setProperty("--button-radius", "0");
    else
      document.documentElement.style.setProperty("--button-radius", "10px");
  };

  const aboutBtn = document.getElementById("aboutBtn");
  const aboutPanel = document.getElementById("aboutPanel");
  const closeAbout = document.getElementById("closeAbout");

  aboutBtn.onclick = () => {
    aboutPanel.classList.add("open");
    settingsPanel.classList.remove("open");
    overlay.style.display = "block";
  };
  closeAbout.onclick = () => {
    aboutPanel.classList.remove("open");
    overlay.style.display = "none";
  };
  overlay.addEventListener("click", () => {
    aboutPanel.classList.remove("open");
  });

  window.addEventListener("keydown", (e) => {
    const key = e.key;
    const btn = document.querySelector(
      `.keys button[data-value="${key}"],
       .keys button[data-fn="${key === "Enter" ? "equals" : key === "Backspace" ? "back" : ""}"]`
    );

    if (btn) {
      btn.classList.add("pressed");
      setTimeout(() => btn.classList.remove("pressed"), 200);
    }
  });
  const exprDisplay = document.getElementById("expr");
  const resultDisplay = document.getElementById("result");
  const displayBox = document.querySelector(".display");

function formatResultNumber(num) {
  if (num === "" || isNaN(num)) return num;
  const [integerPart, decimalPart] = num.toString().split(".");
  const formattedInt = parseInt(integerPart).toLocaleString("en-US");
  return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
}

function showResult() {
  try {
    const expression = exprDisplay.textContent
      .replace(/,/g, "")
      .replace(/×/g, "*")
      .replace(/÷/g, "/");
    const result = eval(expression);
    resultDisplay.textContent = formatResultNumber(result);
    
    displayBox.classList.add("show-result");
  } catch {
    resultDisplay.textContent = "Error";
    displayBox.classList.add("show-result");
  }
}

document.querySelector('[data-fn="equals"]').addEventListener("click", showResult);
const equalsBtn = document.querySelector('[data-fn="equals"]');
if (equalsBtn) {
  equalsBtn.addEventListener("click", showResult);
}

document.querySelectorAll(".keys button[data-value]").forEach(btn => {
  btn.addEventListener("click", () => {
    displayBox.classList.remove("show-result");
  });
});


  render();
})();
