const display = document.getElementById("display");
const calculator = document.getElementById('calculator');
const notepad = document.getElementById('notepad');
const minimizedIcon = document.getElementById('minimized-icon');
// Get reference to the notepad textarea
const notepadText = document.getElementById('notepadText');

let isDragging = false;
let offsetX, offsetY;

// Dragging functionality
function startDrag(e) {
    isDragging = true;
    offsetX = e.clientX - calculator.getBoundingClientRect().left;
    offsetY = e.clientY - calculator.getBoundingClientRect().top;
    calculator.style.cursor = 'grabbing';
}

function drag(e) {
    if (isDragging) {
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;
        calculator.style.left = `${newLeft}px`;
        calculator.style.top = `${newTop}px`;
        // Update notepad position
        updateNotepadPosition();
    }
}

function stopDrag() {
    isDragging = false;
    calculator.style.cursor = 'grab';
}

// Add event listeners to both the calculator and the display
calculator.addEventListener('mousedown', startDrag);
display.addEventListener('mousedown', startDrag);

document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDrag);

// Function to append input to display with a maximum of 8 digits
function appendToDisplay(input) {
    if (display.value === "Error" || display.value === "undefined") {
        display.value = "";
    }

    // Allow only 8 digits
    if (display.value.length < 8) {
        display.value += input;
    }
}

// Function to clear display
function clearDisplay() {
    display.value = "";
}

// Function to clear last entry
function clearEntry() {
    display.value = display.value.slice(0, -1);
}

// Function to cap results to 8 digits
function capToEightDigits(value) {
    // Ensure the input is a number
    if (typeof value !== 'number') {
        return value; // Return original value if not a number
    }

    // Check if the value is zero
    if (value === 0) {
        return 0; // Return zero as is
    }

    // Calculate the number of significant digits
    const absValue = Math.abs(value);
    const integerPart = Math.floor(absValue); // Get the integer part
    const integerDigits = integerPart.toString().length; // Count digits in the integer part

    if (integerDigits >= 8) {
        // If the integer part has 8 or more digits, round to 8 significant digits
        const factor = Math.pow(10, 8 - integerDigits); // Factor to adjust precision
        return Math.round(value * factor) / factor; // Round and return
    } else {
        // If the integer part has less than 8 digits, maintain its value and round decimals
        const factor = Math.pow(10, 8 - integerDigits); // Factor for decimal adjustment
        return Math.round(value * factor) / factor; // Round and return
    }
}

// Example usage
console.log(capToEightDigits(123456789.987654321)); // Returns 12345679
console.log(capToEightDigits(123.456789));          // Returns 123.45679
console.log(capToEightDigits(12345678.9));           // Returns 12345678.9
console.log(capToEightDigits(0));                    // Returns 0
console.log(capToEightDigits(-987654321.123));       // Returns -98765432


// Calculate the result
function calculate() {
    try {
        let result = eval(display.value);
        if (typeof result === "number" && !isNaN(result)) {
            if (result === Infinity || result === -Infinity) {
                display.value = "Error"; // Handle division by zero or infinity
            } else {
                display.value = capToEightDigits(result.toFixed(6)); // Limit to 6 decimal places and cap to 8 digits
            }
        } else {
            display.value = "Error"; // Handle non-numeric results
        }
    } catch (error) {
        display.value = "Error"; // Handle any errors in evaluation
    }
}

// Function to toggle sign
function toggleSign() {
    if (display.value) {
        display.value = display.value.charAt(0) === '-' ? display.value.slice(1) : '-' + display.value;
    }
}

// Function to calculate percentage
function calculatePercentage() {
    if (display.value) {
        display.value = capToEightDigits(parseFloat(display.value) / 100).toString();
    }
}

// Function to toggle notepad visibility
function toggleNotepad() {
    notepad.classList.toggle('open');
    if (notepad.classList.contains('open')) {
        notepad.style.display = 'block';
    } else {
        notepad.style.display = 'none';
    }
}

// Function to minimize the calculator
function minimizeCalculator() {
    const isNotepadOpen = notepad.classList.contains('open');
    if (isNotepadOpen) {
        toggleNotepad(); // Close notepad if it's open
    }

    // Hide the calculator and show the minimized icon
    calculator.style.display = 'none';
    minimizedIcon.style.display = 'flex'; // Show the minimized icon
}

// Function to restore calculator
function restoreCalculator() {
    calculator.style.display = 'block'; // Restore the calculator
    minimizedIcon.style.display = 'none'; // Hide the minimized icon
}

// Update notepad position
function updateNotepadPosition() {
    const calculatorRect = calculator.getBoundingClientRect();
    notepad.style.left = `${calculatorRect.right}px`;
    notepad.style.top = `${calculatorRect.top}px`;
    notepad.style.height = `${calculatorRect.height}px`; // Set notepad height to match calculator
}

// Initial position update
updateNotepadPosition();

// Update position on window resize
window.addEventListener('resize', updateNotepadPosition);

// Sticky note close button functionality
document.getElementById('close-sticky-note').addEventListener('click', function() {
    document.getElementById('sticky-note').style.display = 'none';
});

// Set sticky note position on load
window.addEventListener('load', function() {
    const calculatorRect = calculator.getBoundingClientRect();
    const stickyNote = document.getElementById('sticky-note');
    stickyNote.style.top = `${calculatorRect.top}px`;
    stickyNote.style.left = `${calculatorRect.right + 10}px`;
});

// Updated keydown event listener
document.addEventListener('keydown', function(event) {
    // Check if the notepad textarea is focused
    if (document.activeElement === notepadText) {
        // Ignore key inputs if the notepad textarea is focused
        return;
    }

    const key = event.key;
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        clearEntry();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});
