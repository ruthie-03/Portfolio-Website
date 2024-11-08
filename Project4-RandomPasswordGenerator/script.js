const btnEl = document.querySelector(".btn");
const inputEl = document.getElementById("input");
const copyIconEl = document.querySelector(".fa-copy");
const alertContainerEl = document.querySelector(".alert-container");
const lengthEl = document.getElementById("length");
const lengthValueEl = document.getElementById("length-value");
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");
const strengthEl = document.getElementById("strength");

btnEl.addEventListener("click", () => {
    createPassword();
});

copyIconEl.addEventListener("click", () => {
    copyPassword();
    if (inputEl.value) {
        alertContainerEl.classList.remove("active");
        setTimeout(() => {
            alertContainerEl.classList.add("active");
        }, 2000);
    }
});

lengthEl.addEventListener("input", () => {
    lengthValueEl.textContent = lengthEl.value;
});

function createPassword() {
    const length = lengthEl.value;
    const uppercase = uppercaseEl.checked;
    const lowercase = lowercaseEl.checked;
    const numbers = numbersEl.checked;
    const symbols = symbolsEl.checked;

    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+?:{}[]";

    let chars = "";
    if (uppercase) chars += uppercaseChars;
    if (lowercase) chars += lowercaseChars;
    if (numbers) chars += numberChars;
    if (symbols) chars += symbolChars;

    let password = "";
    for (let i = 0; i < length; i++) {
        const randomNum = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNum, randomNum + 1);
    }
    inputEl.value = password;
    alertContainerEl.innerText = password + " copied!";
    updateStrength(password);
}

function copyPassword() {
    inputEl.select();
    inputEl.setSelectionRange(0, 9999);
    navigator.clipboard.writeText(inputEl.value);
}

function updateStrength(password) {
    let strength = "Weak";
    if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()_+?:{}[\]]/.test(password)) {
        strength = "Strong";
    } else if (password.length >= 8) {
        strength = "Medium";
    }
    strengthEl.innerText = strength;
}
