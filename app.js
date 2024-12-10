// Replace with your Render backend URL
const backendUrl = "https://myboardgames-backend.onrender.com"; // This should be your backend URL

document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchGames();
    setupTestingForm();
    setupSearch();
    setupFilters();
});

// Fetch and display games
function fetchGames() {
    fetch(`${backendUrl}/api/games`)
        .then((response) => response.json())
        .then((data) => {
            const gamesList = document.getElementById('games-list');
            gamesList.innerHTML = '';

            if (data.length === 0) {
                gamesList.innerHTML = '<p>No games found!</p>';
            } else {
                window.allGames = data; // Cache games in the window object
                displayGames(data);
            }
        })
        .catch((error) => {
            console.error('Error fetching games:', error);
            document.getElementById('games-list').innerHTML = '<p>Error loading games!</p>';
        });
}

// Display games and add Edit/Delete buttons
function displayGames(games) {
    const gamesList = document.getElementById('games-list');
    gamesList.innerHTML = '';

    games.forEach((game) => {
        const gameDiv = document.createElement('div');
        gameDiv.innerHTML = `
            <h2>${game.name}</h2>
            <p>Players: ${game.minplayers || 'N/A'} - ${game.maxplayers || 'N/A'}</p>
            <p>Categories: ${game.categories.join(', ')}</p>
            <p>Tag: ${game.tag || 'N/A'}</p>
            <p>Rating: ${game.rating || 'N/A'}</p>
            <p>Owner: ${game.owner}</p>
            <img src="${game.imageurl}" alt="${game.name}" style="max-width:150px;">
            <button class="edit-btn" data-id="${game.id}">Edit</button>
            <button class="delete-btn" data-id="${game.id}">Delete</button>
        `;
        gamesList.appendChild(gameDiv);
    });

    // Attach Edit/Delete event listeners
    document.querySelectorAll('.edit-btn').forEach((button) => {
        button.addEventListener('click', () => handleEditGame(button.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach((button) => {
        button.addEventListener('click', () => handleDeleteGame(button.dataset.id));
    });
}

// Fetch categories and populate the form and filters
function fetchCategories() {
    fetch(`${backendUrl}/api/categories`)
        .then((response) => response.json())
        .then((categories) => {
            const categorySelect = document.getElementById('category');
            const filterSelect = document.getElementById('category-filter');
            categories.forEach((category) => {
                const option = document.createElement('option');
                option.value = category.name; // Assuming the backend expects `category.name`
                option.textContent = category.name;
                categorySelect.appendChild(option);

                const filterOption = option.cloneNode(true);
                filterSelect.appendChild(filterOption);
            });
        })
        .catch((error) => console.error('Error fetching categories:', error));
}

// Handle adding or updating a game
function setupTestingForm() {
    const form = document.getElementById("add-game-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const gameId = form.dataset.id; // If editing, this will have a value
        const method = gameId ? "PUT" : "POST";
        const url = gameId ? `${backendUrl}/api/games/${gameId}` : `${backendUrl}/api/games`;

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

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameData),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to save game");
                return response.json();
            })
            .then(() => {
                alert(gameId ? "Game updated successfully!" : "Game added successfully!");
                form.reset();
                delete form.dataset.id; // Clear form state
                fetchGames();
            })
            .catch((error) => {
                console.error("Error saving game:", error);
                alert("Error saving game");
            });
    });
}

// Handle editing a game
function handleEditGame(gameId) {
    const game = window.allGames.find((g) => g.id === gameId);
    if (!game) return;

    const form = document.getElementById("add-game-form");
    form.dataset.id = gameId;

    document.getElementById("name").value = game.name;
    document.getElementById("minPlayers").value = game.minplayers;
    document.getElementById("maxPlayers").value = game.maxplayers;
    document.getElementById("category").value = game.category;
    document.getElementById("language").value = game.language;
    document.getElementById("rating").value = game.rating;
    document.getElementById("lastPlayed").value = game.lastplayed;
    document.getElementById("owner").value = game.owner;
    document.getElementById("bggUrl").value = game.bggurl;
    document.getElementById("tag").value = game.tag;
    document.getElementById("imageUrl").value = game.imageurl;
}

// Handle deleting a game
function handleDeleteGame(gameId) {
    if (!confirm("Are you sure you want to delete this game?")) return;

    fetch(`${backendUrl}/api/games/${gameId}`, { method: "DELETE" })
        .then((response) => {
            if (!response.ok) throw new Error("Failed to delete game");
            fetchGames();
        })
        .catch((error) => {
            console.error("Error deleting game:", error);
            alert("Error deleting game");
        });
}

// Add dropdown options for predefined tags
function setupTagDropdown() {
    const tags = ["Cooperative", "Competitive", "Solo", "Party"];
    const tagSelect = document.getElementById("tag");
    tags.forEach((tag) => {
        const option = document.createElement("option");
        option.value = tag.toLowerCase();
        option.textContent = tag;
        tagSelect.appendChild(option);
    });
}

// Add event listener to the search input field
function setupSearch() {
    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();

        if (searchTerm === "") {
            // If search input is empty, display all games
            displayGames(window.allGames);
        } else {
            // Filter games by name, category, or tag
            const filteredGames = window.allGames.filter((game) => {
                return (
                    game.name.toLowerCase().includes(searchTerm) ||
                    game.categories.some((category) =>
                        category.toLowerCase().includes(searchTerm)
                    ) ||
                    (game.tag && game.tag.toLowerCase().includes(searchTerm))
                );
            });

            displayGames(filteredGames);
        }
    });
}


