// Replace with your Render backend URL
const backendUrl = "https://myboardgames-backend.onrender.com"; // This should be your backend url


// Wait for the DOM to fully load before executing any JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Initially fetch and display games when the page loads
    fetchGames();
    
    // Setup the form for adding a new game
    setupTestingForm();

    // Setup the search functionality
    setupSearch();

    // Setup the filter functionality
    setupFilters();
});

// Function to fetch and display all games from the backend API
function fetchGames() {
    fetch(`${backendUrl}/api/games`) // This is now correct
        .then((response) => response.json()) // Convert the response into JSON format
        .then((data) => {
            const gamesList = document.getElementById("games-list");
            gamesList.innerHTML = ""; // Clear previous content in the list

            // If no games are found, display a message
            if (data.length === 0) {
                gamesList.innerHTML = "<p>No games found!</p>";
            } else {
                // Store games in a global variable for easy access during searching and filtering
                window.allGames = data; 

                // Display all games initially
                displayGames(data);
            }
        })
        .catch((error) => {
            console.error("Error fetching games:", error); // If there's an error, log it
            document.getElementById("games-list").innerHTML = "<p>Error loading games!</p>";
        });
}



// Function to display games (used for both initial load and filtered search)
function displayGames(games) {
    const gamesList = document.getElementById("games-list");
    gamesList.innerHTML = ""; // Clear the current list of games

    // Loop through each game and create an HTML structure for each one
    games.forEach((game) => {
        const gameDiv = document.createElement("div");
        gameDiv.innerHTML = `
            <h2>${game.name}</h2>
            <p>Players: ${game.minplayers || 'N/A'} - ${game.maxplayers || 'N/A'}</p>
            <p>Category: ${game.category}</p>
            <p>Rating: ${game.rating || "N/A"}</p>
            <p>Owner: ${game.owner}</p>
            <img src="${game.imageurl}" alt="${game.name}" style="max-width:150px;">
        `;
        gamesList.appendChild(gameDiv); // Add the game to the list
    });
}

// Function to handle adding a new game
function setupTestingForm() {
    const form = document.getElementById("add-game-form");
    if (!form) return; // Exit if the form doesn't exist

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Collect data from the form
        const gameData = {
            name: document.getElementById("name").value,
            minPlayers: document.getElementById("minPlayers").value,
            maxPlayers: document.getElementById("maxPlayers").value,
            category: document.getElementById("category").value,
            language: document.getElementById("language").value,
            rating: document.getElementById("rating").value,
            lastPlayed: document.getElementById("lastPlayed").value,
            owner: document.getElementById("owner").value,
            BGGUrl: document.getElementById("bggUrl").value,
            tag: document.getElementById("tag").value,
            imageUrl: document.getElementById("imageUrl").value,
        };

        // Send a POST request to the backend to add the new game
        fetch(`${backendUrl}/api/games`, {
            method: "POST", // Set the request method to POST
            headers: {
                "Content-Type": "application/json", // Set the header to indicate we're sending JSON data
            },
            body: JSON.stringify(gameData), // Convert the game data to a JSON string
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to add game");
                return response.json(); // If successful, convert the response to JSON
            })
            .then((newGame) => {
                alert("Game added successfully!"); // Notify the user that the game was added
                fetchGames(); // Refresh the game list after adding a new game
            })
            .catch((error) => {
                console.error("Error adding game:", error); // If there's an error, log it
                alert("Error adding game"); // Notify the user if there's an error
            });
    });
}

// Function to handle the search functionality
function setupSearch() {
    const searchInput = document.getElementById("search-input"); // Get the search input field

    // Add an event listener to the search input field to trigger search as the user types
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase(); // Get the search term and convert it to lowercase

        if (searchTerm === "") {
            // If the search term is empty, display all games
            displayGames(window.allGames); 
        } else {
            // Filter games based on the search term (case-insensitive)
            const filteredGames = window.allGames.filter((game) =>
                game.name.toLowerCase().includes(searchTerm) // Check if the game's name includes the search term
            );

            // Display the filtered games dynamically
            displayGames(filteredGames);
        }
    });
}

// Function to handle filtering games by category and tag
function setupFilters() {
    const categoryFilter = document.getElementById("category-filter");
    const tagFilter = document.getElementById("tag-filter");

    // Event listener for category filter change
    categoryFilter.addEventListener("change", () => {
        applyFilters();
    });

    // Event listener for tag filter change
    tagFilter.addEventListener("input", () => {
        applyFilters();
    });
}

// Function to apply the active filters (both category and tag)
function applyFilters() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase(); // Get current search term
    const selectedCategory = document.getElementById("category-filter").value.toLowerCase(); // Get selected category filter
    const tagTerm = document.getElementById("tag-filter").value.toLowerCase(); // Get entered tag filter

    // Filter the games based on the search term, selected category, and tag
    const filteredGames = window.allGames.filter((game) => {
        const matchesSearch = game.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === "" || game.category.toLowerCase().includes(selectedCategory);
        const matchesTag = tagTerm === "" || game.tag.toLowerCase().includes(tagTerm);

        return matchesSearch && matchesCategory && matchesTag; // Return games that match all filters
    });

    // Display the filtered games
    displayGames(filteredGames);
}
