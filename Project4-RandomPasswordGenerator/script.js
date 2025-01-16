// Selecting elements from the DOM
const btnEl = document.querySelector(".btn"); // Button to generate password
const inputEl = document.getElementById("input"); // Input field to display the password
const copyIconEl = document.querySelector(".fa-copy"); // Copy icon
const alertContainerEl = document.querySelector(".alert-container"); // Alert box for copy confirmation
const lengthEl = document.getElementById("length"); // Slider for password length
const lengthValueEl = document.getElementById("length-value"); // Displays the selected password length
const uppercaseEl = document.getElementById("uppercase"); // Checkbox for uppercase letters
const lowercaseEl = document.getElementById("lowercase"); // Checkbox for lowercase letters
const numbersEl = document.getElementById("numbers"); // Checkbox for numbers
const symbolsEl = document.getElementById("symbols"); // Checkbox for symbols
const strengthEl = document.getElementById("strength"); // Element to display password strength

// Event listener for generate button - calls createPassword function
btnEl.addEventListener("click", () => {
    createPassword();
});

// Event listener for copy icon - calls copyPassword function
copyIconEl.addEventListener("click", () => {
    copyPassword(); // Copies the generated password to clipboard
    if (inputEl.value) { // If a password exists, show copy confirmation
        alertContainerEl.classList.remove("active"); // Remove active class to show alert
        setTimeout(() => {
            alertContainerEl.classList.add("active"); // Re-add active class after 2 seconds
        }, 2000);
    }
});

// Event listener for length slider - updates displayed length value
lengthEl.addEventListener("input", () => {
    lengthValueEl.textContent = lengthEl.value;
});

// Function to generate a random password
function createPassword() {
    const length = lengthEl.value; // Get password length from slider
    const uppercase = uppercaseEl.checked; // Check if uppercase is selected
    const lowercase = lowercaseEl.checked; // Check if lowercase is selected
    const numbers = numbersEl.checked; // Check if numbers are selected
    const symbols = symbolsEl.checked; // Check if symbols are selected

    // Character sets for password generation
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+?:{}[]";

    let chars = ""; // Initialize empty character set based on user selection
    // Add selected character sets to chars string
    if (uppercase) chars += uppercaseChars;
    if (lowercase) chars += lowercaseChars;
    if (numbers) chars += numberChars;
    if (symbols) chars += symbolChars;

    let password = ""; // Initialize empty password string
    // Generate a random password based on selected character sets
    for (let i = 0; i < length; i++) {
        const randomNum = Math.floor(Math.random() * chars.length); // Get a random index
        password += chars.substring(randomNum, randomNum + 1); // Select random character
    }
    inputEl.value = password; // Display the generated password in input field
    alertContainerEl.innerText = password + " copied!"; // Update copy alert message
    updateStrength(password); // Call function to update password strength
}

// Function to copy generated password to clipboard
function copyPassword() {
    inputEl.select(); // Select the password text
    inputEl.setSelectionRange(0, 9999); // Ensure full selection for mobile devices
    navigator.clipboard.writeText(inputEl.value); // Copy password to clipboard
}

// Function to evaluate password strength
function updateStrength(password) {
    let strength = "Weak"; // Default strength
    // Check if password meets strong criteria (length >=12, contains uppercase, lowercase, numbers, and symbols)
    if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()_+?:{}[\]]/.test(password)) {
        strength = "Strong";
    } else if (password.length >= 8) {  // Medium strength if length is 8+ characters
        strength = "Medium";
    }
    strengthEl.innerText = strength; // Display password strength
}
