"use strict";

window.CalcLogic = {
  evaluate(rawExpr) {
    if (!rawExpr) return NaN;

    let expr = rawExpr;

    expr = expr.replace(/√/g, "Math.sqrt");
    expr = expr.replace(/sin\(([^()]+)\)/g, "Math.sin(($1)*Math.PI/180)");
    expr = expr.replace(/cos\(([^()]+)\)/g, "Math.cos(($1)*Math.PI/180)");
    expr = expr.replace(/tan\(([^()]+)\)/g, "Math.tan(($1)*Math.PI/180)");
    expr = expr.replace(/\^/g, "**");
    expr = expr.replace(/%/g, "/100");

    if (/\/\s*0(\D|$)/.test(expr)) {
      return NaN;
    }
    if (result === Infinity) return NaN;
      if (result === -Infinity) return NaN;
      if (Number.isNaN(result)) return NaN;

    try {
      return Function(`"use strict"; return (${expr})`)();
    } catch {
      return NaN;
    }
  }
};
