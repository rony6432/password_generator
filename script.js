const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
//intialize value
let password = "";
let passwordLength = 10;
let checkcount = 0;
//set password length
hndleslider();
setIndicator("#ccc")

function hndleslider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    let max = inputSlider.max;
    let min = inputSlider.min;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + '% 100%';
}
//indicator set
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
//random generator
function getrandom(mi, mx) {
    return Math.floor(Math.random() * (mx - mi)) + mi;
}

//random numbers

function randomnumber() {
    return getrandom(0, 9);
}

function randomlow() {
    return String.fromCharCode(getrandom(97, 123));
}

function randomupper() {
    return String.fromCharCode(getrandom(65, 91));
}

function randomsym() {
    const a = getrandom(0, symbols.length);
    return symbols.charAt(a);
}

//indicator color define
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}
//copy from cleapboard


async function copyclip() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);

        copyMsg.innerText = "coppied";
    } catch (e) {
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener(
    'input', (e) => {
        passwordLength = e.target.value;
        hndleslider();
    }
)

//copy botton activated

copyBtn.addEventListener('click',
    () => {
        if (passwordDisplay.value)
            copyclip();
    }
)

function handlebox() {
    checkcount = 0;
    allCheckBox.forEach(
        (chckbox) => {
            if (chckbox.checked)
                checkcount++;
        }
    );
    if (checkcount > passwordLength) {
        passwordLength = checkcount;
        hndleslider();
    }
}
allCheckBox.forEach((chckbox) => {
    chckbox.addEventListener('change', handlebox);
});
//generate new password
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
generateBtn.addEventListener('click',
    () => {
        if (checkcount <= 0) return;
        if (passwordLength < checkcount) {
            passwordLength = checkcount;
            hndleslider();
        }
        password = "";
        let funcArr = [];
        if (uppercaseCheck.checked) {
            funcArr.push(randomupper);
        }
        if (lowercaseCheck.checked) {
            funcArr.push(randomlow);
        }
        if (numbersCheck.checked) {
            funcArr.push(randomnumber);
        }
        if (symbolsCheck.checked) {
            funcArr.push(randomsym);
        }
        for (let i = 0; i < funcArr.length; i++) {
            password += funcArr[i]();
        }
        for (let i = 0; i < passwordLength - funcArr.length; i++) {
            let randind = getrandom(0, funcArr.length);
            password += funcArr[randind]();
        }
        password = shufflePassword(Array.from(password));
        passwordDisplay.value = password;
        calcStrength();
    }
);