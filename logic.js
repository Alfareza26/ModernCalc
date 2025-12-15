window.CalcLogic = {

  evaluate(rawExpr) {
    if (!rawExpr || rawExpr.trim() === "") return 0;
    
    let expr = rawExpr;

    // Convert trigonometry from degree → radian
    expr = expr.replace(/sin\(([^)]+)\)/g, "Math.sin(($1) * Math.PI / 180)");
    expr = expr.replace(/cos\(([^)]+)\)/g, "Math.cos(($1) * Math.PI / 180)");
    expr = expr.replace(/tan\(([^)]+)\)/g, "Math.tan(($1) * Math.PI / 180)");

    // Square root
    expr = expr.replace(/sqrt\(/g, "Math.sqrt(");

    // Power operator
    expr = expr.replace(/\^/g, "**");

    // Percent
    expr = expr.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

    let result = Function('"use strict"; return (' + expr + ")")();

    return this.round(result);
  },


  formatNumber(num) {
    if (num === "" || num === null || isNaN(num)) return num;

    const [a, b] = num.toString().split(".");
    const formattedInt = a.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    if (b === undefined) return formattedInt;
    
    return `${formattedInt},${b}`;
  },


  round(num, decimals = 10) {
    if (isNaN(num)) return num;
    
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }

};
