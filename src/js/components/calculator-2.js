console.log("hello");

const device = document.querySelector(".calc");
// if (!device) return;

const buttons = device.querySelectorAll(".keyboard__button");
const screen = device.querySelector(".calc__screen");
let screenContent = screen.textContent;

let isNew = true; // gal prireiks kai naujas skaisius pradedamas
let numberString = "0"; // bus renkamas skaitmuo teksto formoje
let operand = "";
let isArg1 = false;
let isArg2 = false;
let isResult = false;
let arg1, arg2, rezult;

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
    const btnRole = e.target.getAttribute("data-role");
    console.log("Nuspaustas: ", btnRole);

    // tikrinam ar atitinka skaitmenu simbolius --- 0-1-2-3-4-5-6-7-8-9-. ---
    if (/^\d$/.test(btnRole) || btnRole === ".") {
      console.log("skaiciukai ...");
      // nereaguojame jei bandoma iterpti antra kableli
      if (btnRole === "." && numberString.includes(".")) {
        return;
      }
      // vietoje nulio pradzioje - naujas skaitmuo (txt. eilute ir ekranas)
      if (numberString === "0" && btnRole !== ".") {
        numberString = btnRole;
        screen.textContent = numberString;
        return;
      }
      // kitais atvejais - be apribojimu pildom eilute (ir ekrana)
      numberString += btnRole;
      screen.textContent = numberString;
    }

    // like mygtukai - operacijos. viskas priklauso nuo busenos.
  });
});
