// Replace with your Render backend URL
const backendUrl = "https://myboardgames-backend.onrender.com";

// Fetch games and categories on DOM load
document.addEventListener("DOMContentLoaded", () => {
    fetchGames();
    fetchCategories();
    setupAddGameToggle();
    setupSearch();
    setupFilters();
});

// Function to fetch all games
function fetchGames() {
    fetch(`${backendUrl}/api/games`)
        .then(response => response.json())
        .then(data => {
            window.allGames = data; // Save games globally for filtering
            displayGames(data);
        })
        .catch(error => console.error("Error fetching games:", error));
}

// Function to display games
function displayGames(games) {
    const gamesList = document.getElementById("games-list");
    gamesList.innerHTML = "";

    if (games.length === 0) {
        gamesList.innerHTML = "<p>No games found!</p>";
        return;
    }

    games.forEach(game => {
        const gameDiv = document.createElement("div");
        gameDiv.style.border = "1px solid #ccc";
        gameDiv.style.padding = "10px";
        gameDiv.style.marginBottom = "10px";

        gameDiv.innerHTML = `
            <h3>${game.name}</h3>
            <img src="${game.imageurl}" alt="${game.name}" style="max-width: 150px; height: auto;">
            <p>Players: ${game.minplayers} - ${game.maxplayers}</p>
            <p>Categories: ${game.categories.join(", ")}</p>
            <p>Tag: ${game.tag}</p>
            <button onclick="editGame('${game.id}')">Edit</button>
            <button onclick="deleteGame('${game.id}')">Delete</button>
        `;
        gamesList.appendChild(gameDiv);
    });
}

// Fetch categories for dropdowns
function fetchCategories() {
    fetch(`${backendUrl}/api/categories`)
        .then(response => response.json())
        .then(categories => {
            // Populate all category dropdowns
            populateCategoryDropdown("category", categories, false); // Add Game form
            populateCategoryDropdown("edit-category", categories, false); // Edit Game form
            populateCategoryDropdown("category-filter", categories, true); // Category filter
        })
        .catch(error => console.error("Error fetching categories:", error));
}

// Populate category dropdowns
function populateCategoryDropdown(dropdownId, categories, isFilter = false) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = isFilter ? `<option value="">All Categories</option>` : "";

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        dropdown.appendChild(option);
    });

    // Make the "Add Game" form category dropdown a multiple select dropdown
    if (dropdownId === "category" || dropdownId === "edit-category") {
        dropdown.setAttribute("multiple", "multiple"); // Allow multi-selection
    }
}

// Add Game form toggle
function setupAddGameToggle() {
    const toggleButton = document.getElementById("toggle-add-game");
    const addGameForm = document.getElementById("add-game-form");

    toggleButton.addEventListener("click", () => {
        const isHidden = addGameForm.style.display === "none";
        addGameForm.style.display = isHidden ? "block" : "none";
        toggleButton.textContent = isHidden ? "Hide Add Game Form" : "Add a New Game";
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();

        const filteredGames = window.allGames.filter(game =>
            game.name.toLowerCase().includes(searchTerm)
        );
        displayGames(filteredGames);
    });
}

// Filter functionality
function setupFilters() {
    const categoryFilter = document.getElementById("category-filter");
    const tagFilter = document.getElementById("tag-filter");

    categoryFilter.addEventListener("change", applyFilters);
    tagFilter.addEventListener("change", applyFilters);
}

// Apply active filters
function applyFilters() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const selectedCategory = document.getElementById("category-filter").value.toLowerCase();
    const selectedTag = document.getElementById("tag-filter").value.toLowerCase();

    const filteredGames = window.allGames.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || game.categories.includes(selectedCategory);
        const matchesTag = !selectedTag || game.tag.toLowerCase() === selectedTag;

        return matchesSearch && matchesCategory && matchesTag;
    });

    displayGames(filteredGames);
}
