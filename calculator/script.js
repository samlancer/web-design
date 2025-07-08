const toggle_btn = document.querySelector(".toggle_btn");
htmlItself = document.querySelector("html")
numbers = document.querySelectorAll(".number")
reset_btn = document.querySelector(".reset_btn")
del_btn = document.querySelector(".del_btn")
operators = document.querySelectorAll(".operator")

let currentPosition = 0;
// inJA AVAL AZ LOCAL VAZIAT RO MIKHONIM
if (localStorage.getItem("theme") == 'theme2') {
    htmlItself.classList.add('theme2')
    currentPosition = 20;
    toggle_btn.style.transform = "translateX(20px)";

} else if (localStorage.getItem("theme") == 'theme3') {
    htmlItself.classList.add('theme3')
    currentPosition = 42;
    toggle_btn.style.transform = "translateX(42px)";
}
// INJA DARIM BA CLICK THEME AVAZH MIKONIM
toggle_btn.addEventListener("click", function () {
    if (currentPosition === 0) {
        toggle_btn.style.transform = "translateX(20px)";
        htmlItself.classList.remove('theme1')
        htmlItself.classList.add('theme2')
        currentPosition = 20;
        localStorage.setItem('theme', "theme2")
    } else if (currentPosition === 20) {
        toggle_btn.style.transform = "translateX(42px)";
        htmlItself.classList.remove('theme2')
        htmlItself.classList.add('theme3')
        currentPosition = 42;
        localStorage.setItem('theme', "theme3")

    } else {
        toggle_btn.style.transform = "translateX(0)";
        htmlItself.classList.remove('theme3')
        htmlItself.classList.add('theme1')
        currentPosition = 0;
        localStorage.setItem('theme', "theme1")

    }
});
resultInput = document.querySelector(".result")
rawnumber = ''
numbers.forEach(number => {
    number.addEventListener("click", function () {
        keyVal = number.textContent
        if (keyVal == "." && rawnumber.includes(".")) {
            return
        } else {
            rawnumber += keyVal
            if (rawnumber.includes(".")) {
                [int, dec] = rawnumber.split(".")
                resultInput.value = Number(int).toLocaleString() + "." + dec
            } else {

                resultInput.value = Number(rawnumber).toLocaleString()
            }


        }

    })
});
del_btn.addEventListener('click', function () {
    rawnumber = rawnumber.slice(0, -1)
    if (rawnumber == "") {
        resultInput.value = ""
    }
    if (rawnumber.includes(".")) {
        [int, dec] = rawnumber.split(".")
        resultInput.value = Number(int).toLocaleString() + "." + dec
    } else {

        resultInput.value = Number(rawnumber).toLocaleString()
    }
})
let firstOperand = null;
let selectedOperator = null;
let waitingForSecondOperand = false;

reset_btn.addEventListener("click", function () {
    resultInput.value = "";
    rawnumber = "";
    firstOperand = null;
    selectedOperator = null;
    waitingForSecondOperand = false;
});

operators.forEach(operator => {
    operator.addEventListener("click", function () {
        if (rawnumber === '') return;

        if (firstOperand === null) {
            firstOperand = parseFloat(rawnumber);
        } else if (selectedOperator && !waitingForSecondOperand) {
            firstOperand = performCalculation(selectedOperator, firstOperand, parseFloat(rawnumber));
            resultInput.value = formatNumber(firstOperand);
        }

        selectedOperator = operator.textContent;
        rawnumber = '';
        waitingForSecondOperand = true;
    });
});
document.querySelector(".equal_btn").addEventListener("click", function () {
    if (selectedOperator && rawnumber !== '') {
        const result = performCalculation(selectedOperator, firstOperand, parseFloat(rawnumber));
        resultInput.value = formatNumber(result);
        rawnumber = result.toString();
        firstOperand = null;
        selectedOperator = null;
        waitingForSecondOperand = false;
    }
});
function performCalculation(operator, first, second) {
    switch (operator) {
        case '+':
            return first + second;
        case '-':
            return first - second;
        case '×':
            return first * second;
        case '÷':
            return second === 0 ? 'Error' : first / second;
    }
}
function formatNumber(num) {
    return Number(num).toLocaleString(undefined, { maximumFractionDigits: 10 });
}
