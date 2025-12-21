const device = document.querySelector(".calc");
// if (!device) return;

const buttons = device.querySelectorAll(".keyboard__button");
const screen = device.querySelector(".calc__screen");

let isNew = true; // gal prireiks kai naujas skaisius pradedamas
let numberString = "0"; // bus renkamas skaitmuo teksto formoje
let operand = "";
let isArg1 = false;
let isArg2 = false;
let isResult = false;
let arg1,
  arg2,
  rezult = null;

showVariables("PRADINE BUSENA");

/* ---------      Darbo logika    -------------------------
  Mygtukas      numberString  screenC.. |  arg1  arg2  rezult  operand  | paaiskinimas
  - pradine b.    0           0             X     X     X                 pradioj tuscia, ekrane nulis
  -----------------------------------------------------------------------------------------------------
  operacija       0           0             X     X     X                 negalimas veiksmas !!
  kablelis .      0 -> 0.     0 -> 0.       X     X     X                 pries kableli - nulis
  skaicius 7      0 -> 7      0 -> 7        X     X     X                 sveika dalis  - ne nulis
  kablelis .    7   -> 7.     7 -> 7.       X     X     X                 skaicius gauna trupmenos zenkla
  skaicius 2    7.  -> 7.2    7. -> 7.2     X     X     X                 skaiciaus eilute papildoma
  kablelis .    7.2 -> 7.2    7.2 -> 7.2    X     X     X                 antro kablelio negali buti !!
  -----------------------------------------------------------------------------------------------------
    C             ->0          ->0        ->X    ->X   ->X                viskas i pradzia ???

  operand  +     Number()    7.2 -> 7.2+  X->7.2  X     X       +     Nera pirmo OP -> suteik. reikme
                                                                      ir ekrane - operando simbolis
  operand  -        +        7.2+ -> 7.2-   7.2   X     X       -     Stebim operanda - galim pakeisti
  operand  -        -        7.2- -> 7.2-   7.2   X     X       -     Stebim operanda - galim pakeisti





*/

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
      showVariables("51 - formuojamas skaicius", btnRole);
      return;
    }

    // jei norime isvalyti visus duomenis ...
    if (btnRole === "C") {
      clearAll();
      renderScreen();
      showVariables("59 - Istrinu viska", btnRole);
      return;
    }

    // ------------------
    // like mygtukai - operacijos. Viskas priklauso nuo busenu.
    // ------------------

    // <--- ignoruojam "=" jei dar nebuvo ivestas veiksmas
    if (btnRole === "=" && !operand) {
      console.log("nera nurodyta operacija", btnRole);
      return;
    }

    // -----  surinktas 1-as argumentas ir operandas (ne ligybe!):
    if (!isArg1 && btnRole !== "=") {
      // uzbaigiamas pirmas operandas (nes jo nera) ir pridedam veiksmo zenkla
      // po pirmo skaiciaus ligybes netaikome - ignoruojame !
      arg1 = Number(numberString);
      numberString = "";
      isArg1 = isNew = true;
      operand = btnRole;
      renderScreen();
      showVariables("83 - Pirmas skaitmuo ivestas", btnRole);
      return;
    }

    // ----   1-as argumentas jau yra. Tikrinti numberString:
    //        a)  jei tuscia - tieisog uzfiksuojamas operandas - busimas veiksmas. Ignoruoti "=".
    //                        - kartojant - galima pakeisti busima veiksma
    //        b)  jei netuscia - fiksuojamas 2-as argumentas ir atliekamas veiksmas pagal esama operanda
    //              papildomai:
    //                  - jei tai "=" - tiesiog parodoma veiksmo eilute
    //                  - jei tai operacija - rodom rezultata kaip 1-a argumenta ir nauja veiksma
    // --------------------------------------------------------------------------------------------------
    if (isArg1 && !isArg2) {
      if (numberString === "") {
        operand = btnRole;
        renderScreen();
      } else {
        arg2 = Number(numberString);
        numberString = "";
        isArg2 = isNew = true;
      }
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
    // dirbam su rezultatu
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
    showVariables("Po atliktu skaicaivimu", btnRole);
  });
});

function showVariables(comment = "", role = "?") {
  console.log("↓ ------", comment, "------- ↓");
  console.log(
    `IsNew: ${isNew} | NumberString: "${numberString}" || isArg1: ${isArg1}, isArg2: ${isArg2}, isResult: ${isResult} || Arg1: ${arg1} | Arg2: ${arg2} | Operand: "${operand}" | Result: ${rezult} | Pressed: > ${role} <  `
  );
}

function loadNum(symb) {
  // nereaguojame jei bandoma iterpti antra kableli
  if (symb === "." && numberString.includes(".")) {
    return;
  }

  if (isNew) {
    if (symb === ".") {
      numberString = "0.";
    } else {
      numberString = symb;
    }
    isNew = false;
  } else {
    numberString += symb;
  }
}

function renderScreen() {
  const n1 = isArg1 ? arg1 : "";
  const n2 = isArg2 ? arg2 : "";
  let op = operand ? operand : "";
  if (op === "/") {
    op = "÷";
  }

  if (isResult) {
    // gautas skaiciavimu rezultatas - pilna eilute
    screen.textContent = n1 + op + n2 + "=" + formatResult(rezult);
  } else {
    // dar nepaskaiciuota - formuojama operaciju eilute
    screen.textContent = n1 + op + n2 + numberString;
  }
}

function clearAll() {
  arg1 = arg2 = rezult = null;
  isArg1 = isArg2 = isResult = false; // naikinti jei nenaudosime
  operand = "";
  numberString = "0";
  isNew = true;
}

function formatResult(value, maxLen = 8) {
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
  console.log("Rezultatas: ", value, " |> Suformatavus: ", text);

  return text;
}
