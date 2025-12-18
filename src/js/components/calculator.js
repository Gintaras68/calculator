export function myCalculator() {
  const device = document.querySelector(".calc");
  if (!device) return;

  let screen = device.querySelector(".calc__screen");
  let isNew = true; // gal prireiks kai naujas skaisius pradedamas
  let input = "0"; // bus renkamas skaitmuo teksto formoje
  let arg1 = 0;
  let arg2 = 0;
  let operand = "";
  let rezult = 0;

  const buttons = device.querySelectorAll(".keyboard__button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const value = e.target.textContent.trim();

      // jei nuspaustas skaičius ar kableis ...
      if (/^\d$/.test(value) || value === ".") {
        // if (isNew) {
        //   screen.textContent = "0";
        //   isNew = false;
        // }

        // --------------------
        // Jei nuspaudžiamas "antras" kablelis - nereaguojam
        if (value === "." && input.includes(".")) {
          return;
        }
        // Jei tai pirmas įvedamas skaitmuo - keičiam vietoje nulio
        if (screen.textContent === "0" && value !== ".") {
          screen.textContent = value;
          input = value;
          console.log(
            `Ivedamas pirmas skaitmuo: isNew: ${isNew} | input: ${input} | arg1: ${arg1} | arg2: ${arg2} `
          );
          return;
        }
        // kitais atvejais - pridedam naują simbolį
        screen.textContent += value;
        input += value;
        // -------------------------------

        console.log(
          `Busena po skaitmens iv.: isNew: ${isNew} | input: ${input} | arg1: ${arg1} | arg2: ${arg2} `
        );
        return;
      }

      // jei nuspaustas išvalymas
      if (value === "C") {
        input = "0";
        operand = "";
        arg1 = arg2 = 0;
        screen.textContent = input;
        return;
      }

      // jei nuspaustas vienas is likusiu (valdymo) mygtuku ...
      // vadinasi bus atliekama operacija (is karto arba ivedus kita operanda)
      if (!arg1) {
        // dar nera pirmo argumento - formuojam ji ir saugom operanda
        arg1 = Number(input);
        input = "";
        operand = value;
        screen.textContent += operand;
      } else {
        // ----   REAKCIJA KAI PIRMA SARGUMENTAS JAU YRA   ------
        if (!arg2 && operand === "") {
          // pirmas argumentas yra bet truksta antro - saugom operanda (ir pridedam ekrane)
          operand = value;
          screen.textContent += operand;
          console.log(
            `Busena po operando iv.: isNew: ${isNew} | input: ${input} | arg1: ${arg1} | arg2: ${arg2} `
          );
          return;
        }

        // turim du argumentus - atliekam veiksma
        arg2 = Number(input);
        input = "";
        // ----------------------------------------------------------
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

          case "÷":
            rezult = arg1 / arg2;
            break;

          default:
            break;
        }

        screen.textContent = rezult;
        arg1 = rezult;
        arg2 = 0;
        operand = "";

        if (value !== "=") {
          operand = value;
          screen.textContent + operand;
        }
        // ----------------------------------------------------------
        isNew = true;
        console.log(
          `Busena po atlikto veiksmo: isNew: ${isNew} | input: ${input} | arg1: ${arg1} | arg2: ${arg2} | operand ${operand} | `
        );
      }
    });
  });
}
