// Object to store exchange rates, with USD as the base currency (1 USD = 1 USD)
const exchangeRates = { usd: 1 };
// Selecting the "From" currency dropdown inside the .converter-container
const fromCurrency = document.querySelector(".converter-container #from");
// Selecting the "To" currency dropdown inside the .converter-container
const toCurrency = document.querySelector(".converter-container #to");
// Selecting the input field where the user enters the amount to be converted
const inputAmount = document.querySelector(
  ".converter-container .input-amount"
);
// Selecting the result display area where the converted currency value will be shown
const result = document.querySelector(".converter-container .result");
// Selecting the swap button, which allows users to switch the "From" and "To" currencies
const swapBtn = document.querySelector(".converter-container .swap-btn");

// Asynchronous function to fetch exchange rates and populate currency dropdowns
const init = async () => { 
    try {
      // Fetching exchange rate data for USD from FloatRates API
      const res = await fetch(`https://www.floatrates.com/daily/usd.json`);  
      // Parsing the response as JSON
      const data = await res.json();

      // Check if the response is successful
      if (res.ok) {
        // Loop through each currency in the fetched data
        for (const currencyCode in data) {
          const currencyInfo = data[currencyCode]; // Get details of the currency
          const {code, name} = currencyInfo; // Destructuring to get currency code and name

          // Store the exchange rate in the exchangeRates object
          exchangeRates[currencyCode] = currencyInfo.rate;

          // Create an option element for the "From" currency dropdown
          const option1 = document.createElement("option");
          option1.value = code;  // Set the option value to the currency code
          option1.textContent = `${code} - ${name}`;  // Display text as "CODE - Name"

          // Clone the option element to use in the "To" currency dropdown
          const option2 = option1.cloneNode(true);

        // Append the option to the respective dropdown menus
        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
      }

      // Preselect default currencies in dropdowns (adjust indices as needed)
      fromCurrency.value = fromCurrency.options[5].value; // Select the 6th option
      toCurrency.value = toCurrency.options[4].value; // Select the 5th option

    }
  } catch (error) {
        // Log an error message if fetching currency data fails
        console.log("Error loading currency data");
  }
};

// Initialize the currency conversion setup by calling the init function
init();

// Function to handle currency conversion
const convert = () => {
  // Get the user input amount and convert it to a floating-point number
  const inputValue = parseFloat(inputAmount.value);
  // Get the selected currency values and convert them to lowercase for consistency
  const fromCurrencyValue = fromCurrency.value.   toLowerCase();
  const toCurrencyValue = toCurrency.value.toLowerCase();

  // Perform the currency conversion using exchange rates
  const convertedValue = 
    (inputValue * exchangeRates[toCurrencyValue]) / 
    exchangeRates[fromCurrencyValue];

  // Format the converted value and wrap it in a span for styling
  const resultValue = `<span class='result-currency'>${toCurrencyValue}</span> ${convertedValue.toFixed(
    2
  )}`;

// Display the result, or show an error message if the input is invalid
result.innerHTML = isNaN(convertedValue) ? "Invalid Input" : resultValue;
};

// Event listeners to trigger conversion when the currency selection or input amount changes
toCurrency.addEventListener("change", convert);
fromCurrency.addEventListener("change", convert);
inputAmount.addEventListener("input", convert);

// Event listener for the swap button to switch the selected currencies
swapBtn.addEventListener("click", () => {
  // Store the current currency values before swapping
  const fromCurrencyValue = fromCurrency.value;
  const toCurrencyValue = toCurrency.value;
  
// Swap the selected currencies
fromCurrency.value = toCurrencyValue;
toCurrency.value = fromCurrencyValue;
  // Recalculate the conversion after swapping
  convert();
});
