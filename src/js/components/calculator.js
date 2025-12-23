/**
 *  Sukuriamas kalkuliatoriaus komponentas duoto DOM-elemento viduje.
 * @param {HTMLElement|string} root
 *  DOM-elementas, kuriame randasi kalkuliatoriaus sužymėjimas
 *  arba CSS-selektoriaus, kuris žymi įėjimą į jį, eilutė.
 *
 * @returns {void}
 *
 * @example
 * // Vienas kalkuliatorius (labiausiai tikėtinas atvejis)
 * const el = document.querySelector(".calc");
 * createCalculator(el);
 *
 * @example
 * // Keli kalkuliatoriai
 * document.querySelectorAll(".calc").forEach(createCalculator);
 */
export function createCalculator(root) {
  let device = null;

  if (typeof root === "string") {
    device = document.querySelector(root);
  } else if (root instanceof HTMLElement) {
    device = root;
  }

  if (!device) {
    console.warn("Calculator init failed:", root);
    return;
  }

  const DISPLAY_LENGTH = 17;
  const buttons = device.querySelectorAll(".keyboard__button");
  const screen = device.querySelector(".calc__screen");

  let isNew = true;
  let numberString = "0";
  let operand = "";
  let isArg1 = false;
  let isArg2 = false;
  let isResult = false;
  let arg1,
    arg2,
    rezult = null;

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const btnRole = e.currentTarget.dataset.role;

      // jei atitinka skaitmenu simbolius --- 0-1-2-3-4-5-6-7-8-9-. ---
      if (/^\d$/.test(btnRole) || btnRole === ".") {
        if (isResult) {
          arg1 = arg2 = rezult = null;
          isArg1 = isArg2 = isResult = false;
          operand = "";
          isNew = true;
        }
        loadNum(btnRole);
        renderScreen();
        return;
      }

      // jei norime isvalyti visus duomenis ...
      if (btnRole === "C") {
        clearAll();
        renderScreen();
        return;
      }

      // ------------------
      // like mygtukai - operacijos. Viskas priklauso nuo busenu.
      // ------------------

      // <--- ignoruojam "=" jei dar nebuvo ivestas veiksmas
      if (btnRole === "=" && !operand) return;

      // -----  surinktas 1-as argumentas ir operandas (ne ligybe!):
      if (!isArg1 && btnRole !== "=") {
        arg1 = Number(numberString);
        numberString = "";
        isArg1 = isNew = true;
        operand = btnRole;
        renderScreen();
        return;
      }

      if (isArg1 && !isArg2) {
        if (numberString === "") {
          operand = btnRole;
          renderScreen();
          return; // nieko nedarom - dar nera antro operando
        }

        arg2 = Number(numberString);
        numberString = "";
        isArg2 = isNew = true;
      }

      // ↑ ↑ - gavom 2-a operanda - ↑ ↑
      // ↓ ↓   atliekam operacija   ↓ ↓

      switch (operand) {
        case "+":
          rezult = arg1 + arg2;
          break;

        case "-":
          rezult = arg1 - arg2;
          break;

        case "*":
          rezult = arg1 * arg2;
          break;

        case "/":
          if (arg2 === 0) {
            clearAll();
            screen.textContent = "Error";
            return;
          }
          rezult = arg1 / arg2;
          break;

        default:
          break;
      }
      isResult = true;

      if (btnRole === "=") {
        renderScreen();
      } else {
        arg1 = rezult;
        arg2 = rezult = null;
        isArg2 = isResult = false;
        operand = btnRole;
        renderScreen();
        isNew = true;
      }
    });
  });

  // ----- additional functions...  -----------------------
  function loadNum(symb) {
    if (symb === "." && numberString.includes(".")) return;

    if (isNew) {
      if (symb === ".") {
        numberString = "0.";
      } else {
        numberString = symb;
      }
    } else {
      numberString += symb;
    }
    isNew = false;
  }

  function renderScreen() {
    const n1 = isArg1 ? arg1 : "";
    const n2 = isArg2 ? arg2 : "";
    let op = operand ? operand : "";
    if (op === "/") op = "÷";

    if (isResult) {
      const equal = formatResult(rezult);
      const totalLength =
        n1.toString().length + n2.toString().length + equal.length;

      if (totalLength > DISPLAY_LENGTH - 2) {
        screen.textContent = "... =" + equal;
      } else {
        screen.textContent = n1 + op + n2 + "=" + equal;
      }
      return;
    }
    // dar nepaskaiciuota - formuojama operaciju eilute
    screen.textContent = n1 + op + n2 + numberString;
  }

  function clearAll() {
    arg1 = arg2 = rezult = null;
    isArg1 = isArg2 = isResult = false; // naikinti jei nenaudosime
    operand = "";
    numberString = "0";
    isNew = true;
  }

  function formatResult(value, maxLen = DISPLAY_LENGTH - 4) {
    if (value === null || value === undefined) return "";
    if (!Number.isFinite(value)) return "Error";
    let text = value.toString();
    if (text.length <= maxLen) return text;

    // Pirmiausia bandoma tiesiog apriboti ilgi mazinant tiksluma
    const precision = maxLen - 2; // rezervuojama vieta simboliams "0."
    text = value.toPrecision(precision);

    // Jei gautas rezultatas per ilgas - panaudojam eksponentine forma
    if (text.length > maxLen) text = value.toExponential(6);

    // jei yra, pasalinami nereiklaingi numeriai
    text = text.replace(/\.?0+e/, "e").replace(/\.?0+$/, "");

    return text;
  }

  function showVariables(comment = "", role = "?") {
    const l1 = isArg1 ? "Yes" : "No ";
    const l2 = isArg2 ? "Yes" : "No ";
    const l3 = isResult ? "Yes" : "No ";
    const l4 = isNew ? "Yes" : "No ";
    console.log(
      `↓¯¯¯¯ isArg1 | operand | isArg2 | isResult | isNew | <<< btn > numbStr. >> arg1 / arg2 / rezult | ¯¯¯  ${comment} ¯¯↓`
    );
    console.log(
      ` →      ${l1}     > ${operand} <      ${l2}       ${l3}      ${l4}   | <<< "${role}" >  "${numberString}" >>  ${arg1}  /  ${arg2}  /  ${rezult} |`
    );
    console.log("");
  }
}
