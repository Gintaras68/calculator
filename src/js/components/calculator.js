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

    // tikrinam ar atitinka skaitmenu simbolius --- 0-1-2-3-4-5-6-7-8-9-. ---
    if (/^\d$/.test(btnRole) || btnRole === ".") {
      loadNum(btnRole);
      return;
    }

    // jei norime isvalyti visus duomenis ...
    if (btnRole === "C") {
      arg1 = arg2 = rezult = null;
      isArg1 = isArg2 = isResult = false; // naikinti jei nenaudosime
      operand = "";
      numberString = "0";
      screen.textContent = numberString;
      isNew = true;
      showVariables("Istrinu viska", btnRole);
      return;
    }

    // like mygtukai - operacijos. viskas priklauso nuo busenos.
    // -----  orientuojames i pirma operanda:
    if (!isArg1 && btnRole !== "=") {
      // uzbaigiamas pirmas operandas (nes jo nera) ir pridedam veiksmo zenkla
      // po pirmo skaiciaus ligybes netaikome - ignoruojame !
      arg1 = Number(numberString);
      numberString = "";
      isArg1 = isNew = true;
      operand = btnRole;
      screen.textContent += operand;
      showVariables("Pirmas skaitmuo ivestas", btnRole);
      return;
    }

    if (isArg1 && !isResult) {
      // o jei pirmas yra - uzbaigiamas antras operandas.
      // be to - mes jauturime veiksmo operanda. Esamas nuspaudimas - ateiciai.
      arg2 = Number(numberString);
      numberString = "";
      isArg2 = isNew = true;
      // Turim argumentus ir operanda - galim atlikti veiksmus
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
          rezult = arg1 / arg2;
          break;

        default:
          break;
      }
      isResult = true;
      arg1 = rezult;
      arg2 = null;
      isArg2 = false;
      if (btnRole === "=") {
        operand = "";
        screen.textContent += "=" + rezult;
      } else {
        screen.textContent = rezult + btnRole;
      }
      showVariables("atliktas veiksmas", btnRole);
      return;
    }

    // rezultatas kaip pirmas operandas - priimam veiksma:
    if (isArg1 && isResult) {
      // tiesiog naujas operandas veiksmams
      console.log("naujas veiksmas");

      operand = btnRole;
      screen.textContent = arg1 + operand;
    }
  });
});

function showVariables(comment = "", role = "?") {
  console.log("↓ ------", comment, "------- ↓");
  console.log(
    `IsNew: ${isNew}  | NumberString: ${numberString} | Pressed: ${role}  || isArg1: ${isArg1} , isArg2: ${isArg2}, isResult: ${isResult} `
  );
  console.log(
    `Arg1: ${arg1}  | Arg2: ${arg2} | Operand: ${operand} | Result: ${rezult}`
  );
}

function loadNum(symb) {
  // nereaguojame jei bandoma iterpti antra kableli
  if (symb === "." && numberString.includes(".")) {
    return;
  }
  // jei skaiciu pradedam nuo kablelio, pridedam nuli pradzioje
  if (symb === "." && numberString === "") {
    numberString += "0.";
    isNew = false;
    screen.textContent += numberString;
    showVariables("skaitmuo <1 ", symb);
    return;
  }
  // vietoje nulio pradzioje - naujas skaitmuo (txt. eilute ir ekranas)
  if (numberString === "0" && symb !== ".") {
    numberString = symb;
    screen.textContent = numberString;
    isNew = false;
    showVariables("Pradedamas pirmas sk.", symb);
    return;
  }
  // kitais atvejais - be apribojimu pildom eilute (ir ekrana)
  numberString += symb;
  screen.textContent += symb;
  isNew = isResult = false;

  showVariables("formuojamas skaicius", symb);
  return;
}

function renderScreen() {}
