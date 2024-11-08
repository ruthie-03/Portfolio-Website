// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to essential elements in the document
    const enterButton = document.getElementById('enter-button'); // Button to enter the main content
    const themeToggleCover = document.getElementById('theme-toggle-cover'); // Cover for theme toggle
    const themeToggleMain = document.getElementById('theme-toggle-main'); // Main area for theme toggle
    const coverPage = document.getElementById('cover-page'); // Cover page element
    const mainContent = document.getElementById('main-content'); // Main content area
    const navMenu = document.getElementById('nav-menu'); // Navigation menu
    const body = document.body; // Reference to the body element
    const quoteText = document.getElementById('quote-text'); // Element to display quotes


    // Array of quotes to be displayed
    const quotes = [
        "The only limit to our realization of tomorrow is our doubts of today.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "Do not watch the clock. Do what it does. Keep going.",
        "Keep your face always toward the sunshine—and shadows will fall behind you."
    ];

    // Function to toggle between light and dark themes
    const toggleTheme = () => {
        // Toggle the body's theme class
        body.classList.toggle('dark-theme'); // Toggle dark theme
        body.classList.toggle('light-theme'); // Toggle light theme
        // Store the current theme in local storage
        localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    };

    
    // Event listener for the enter button to transition to the main content
    enterButton.addEventListener('click', () => {
        coverPage.classList.add('hidden'); // Hide the cover page
        mainContent.classList.add('visible'); // Show the main content
        // Wait for 1 second before hiding the cover page completely
        setTimeout(() => {
            coverPage.style.display = 'none'; // Completely hide the cover page
            document.getElementById('quote-container').style.display = 'none'; // Hide quote text after entering
        }, 0); // Match the transition duration of the animation
    });


    // Event listeners for the theme toggle buttons
    themeToggleCover.addEventListener('click', toggleTheme); // Theme toggle for cover
    themeToggleMain.addEventListener('click', toggleTheme); // Theme toggle for main area

    // Set initial theme based on the value stored in local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        // Apply the saved theme if it exists
        body.classList.add(savedTheme === 'dark' ? 'dark-theme' : 'light-theme');
    } else {
        // Default to light theme if no theme is saved
        body.classList.add('light-theme');
    }



    // Function to display quotes in the quoteText element
    let quoteIndex = 0; // Index for tracking the current quote
    const displayQuote = () => {
        // Set the text content of quoteText to the current quote
        quoteText.textContent = quotes[quoteIndex];
        // Update the quote index for the next quote
        quoteIndex = (quoteIndex + 1) % quotes.length; // Loop back to the first quote
    };

    // Initially display the first quote
    displayQuote();
    // Change the displayed quote every 20 seconds
    setInterval(displayQuote, 20000);

    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('nav a'); // Get all navigation links

    links.forEach(link => {
        // Add a click event listener to each link
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default anchor link behavior
            const targetId = link.getAttribute('href').substring(1); // Get the target section ID
            const targetElement = document.getElementById(targetId); // Find the target element by ID

            // Calculate the distance to scroll
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset; // Position of the target element
            const startPosition = window.pageYOffset; // Current scroll position
            const distance = targetPosition - startPosition; // Total distance to scroll
            const duration = 800; // Duration of the scrolling animation in milliseconds
            let start = null; // Timestamp for the animation

            // Smooth scrolling function
            const step = (timestamp) => {
                if (!start) start = timestamp; // Initialize the start timestamp
                const progress = timestamp - start; // Calculate how far along the animation is
                // Calculate the current scroll position using easing
                const scrollAmount = easeInOutQuad(progress, startPosition, distance, duration);
                window.scrollTo(0, scrollAmount); // Scroll to the calculated position
                if (progress < duration) {
                    window.requestAnimationFrame(step); // Continue the animation if the duration isn't reached
                }
            };

            // Easing function for smooth scrolling animation
            const easeInOutQuad = (t, b, c, d) => {
                t /= d / 2; // Normalize time for the easing function
                if (t < 1) return c / 2 * t * t + b; // Ease in
                t--; // Ease out
                return -c / 2 * (t * (t - 2) - 1) + b; // Ease out
            };

            window.requestAnimationFrame(step); // Start the smooth scrolling animation

           
        });
    });

   
});

// Carousel scrolling functionality
let currentIndex = 0; // Index for tracking the current position in the carousel

// Function to scroll the carousel in the specified direction
function scrollCarousel(direction) {
    const carousel = document.querySelector('.carousel'); // Get the carousel element
    const cards = document.querySelectorAll('.carousel-card'); // Get all the cards in the carousel
    const totalCards = cards.length; // Total number of cards
    const visibleCards = 3; // Number of visible cards (this can be adjusted as needed)

    // Calculate the width of one card, including margin
    const cardWidth = cards[0].offsetWidth + 20; // Card width + margin

    // Update the current index based on the direction of scrolling
    currentIndex += direction * visibleCards;

    // Ensure the index stays within the bounds of the carousel
    if (currentIndex < 0) {
        currentIndex = 0; // Prevent going before the first card
    } else if (currentIndex > totalCards - visibleCards) {
        currentIndex = totalCards - visibleCards; // Prevent going beyond the last visible card
    }

    // Scroll the carousel by updating the transform property
    carousel.style.transform = `translateX(${-currentIndex * cardWidth}px)`; // Apply the translation to scroll
}

//warning message//


// Monitor window resizing to ensure the correct display of the warning message
window.addEventListener('resize', function() {
    if (window.innerWidth !== 1536 || window.innerHeight !== 864) {
        document.getElementById('warning-message').style.display = 'block';
        document.getElementById('cover-page').style.display = 'none';
        document.getElementById('main-content').style.display = 'none';
    } else {
        document.getElementById('warning-message').style.display = 'none';
        document.getElementById('cover-page').style.display = 'block';
        document.getElementById('main-content').style.display = 'none';
    }
});


console.log(window.innerWidth);  // This will give the width of the viewport
console.log(window.innerHeight); // This will give the height of the viewport

console.log(screen.width);  // Should log 1920px if the screen resolution is 1920px
console.log(screen.height); // Should log 1080px if the screen resolution is 1080px
