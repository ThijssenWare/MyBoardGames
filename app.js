// Replace with your Render backend URL
const backendUrl = "https://myboardgames-backend.onrender.com"; // Ensure "https" is correct here

document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display games
    fetchGames();

    // Setup form for adding new games
    setupTestingForm();

    // Setup search input event
    document.getElementById("search-btn").addEventListener("click", searchGames);
    document.getElementById("search-input").addEventListener("keyup", searchGames);
});

// Function to fetch and display games
function fetchGames() {
    fetch(`${backendUrl}/api/games`)
        .then((response) => response.json())
        .then((data) => {
            const gamesList = document.getElementById("games-list");
            gamesList.innerHTML = ""; // Clear previous content
            if (data.length === 0) {
                gamesList.innerHTML = "<p>No games found!</p>";
            } else {
                data.forEach((game) => {
                    const gameDiv = document.createElement("div");
                    gameDiv.classList.add("game-item");
                    gameDiv.innerHTML = `
                        <h3>${game.name}</h3>
                        <p>Players: ${game.minPlayers} - ${game.maxPlayers}</p>
                        <p>Category: ${game.category}</p>
                        <p>Rating: ${game.rating}</p>
                        <p>Owner: ${game.owner}</p>
                        <img src="${game.imageUrl}" alt="${game.name}" style="max-width:150px;">
                        <button class="update-btn" onclick="updateGame(${game.id})">Update</button>
                        <button class="delete-btn" onclick="deleteGame(${game.id})">Delete</button>
                    `;
                    gamesList.appendChild(gameDiv);
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching games:", error);
            document.getElementById("games-list").innerHTML = "<p>Error loading games!</p>";
        });
}

// Handle game update
function updateGame(gameId) {
    // Collect updated data (you could populate these from a form in your app)
    const updatedData = {
        name: "Updated Game Name",  // Collect from form or input fields
        minPlayers: 3,
        maxPlayers: 5,
        category: "Strategy",
        language: "English",
        rating: 4.5,
        lastPlayed: "2024-12-08",
        owner: "John Doe",
        BGGUrl: "https://example.com",
        tag: "Competitive",
        imageUrl: "https://example.com/image.jpg"
    };

    fetch(`${backendUrl}/api/games/${gameId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(updatedGame => {
        console.log("Game updated:", updatedGame);
        fetchGames();  // Refresh the game list after update
    })
    .catch(error => {
        console.error("Error updating game:", error);
    });
}

// Handle game delete
function deleteGame(gameId) {
    fetch(`${backendUrl}/api/games/${gameId}`, {
        method: 'DELETE',
    })
    .then(() => {
        console.log("Game deleted");
        fetchGames();  // Refresh the game list after deletion
    })
    .catch(error => {
        console.error("Error deleting game:", error);
    });
}

// Testing bit: Setup form to add a new game
function setupTestingForm() {
    const form = document.getElementById("add-game-form");
    if (!form) return; // Exit if the form doesn't exist

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission

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

        fetch(`${backendUrl}/api/games`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(gameData),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to add game");
                return response.json();
            })
            .then((newGame) => {
                alert("Game added successfully!");
                fetchGames(); // Refresh games list
            })
            .catch((error) => {
                console.error("Error adding game:", error);
                alert("Error adding game");
            });
    });
}

// Function to search games based on name (can be extended to more filters)
function searchGames() {
    const searchQuery = document.getElementById("search-input").value;
    fetch(`${backendUrl}/api/games?name=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
            const gamesList = document.getElementById("games-list");
            gamesList.innerHTML = ''; // Clear current list
            if (data.length === 0) {
                gamesList.innerHTML = "<p>No games found!</p>";
            } else {
                data.forEach(game => {
                    const gameDiv = document.createElement("div");
                    gameDiv.classList.add("game-item");
                    gameDiv.innerHTML = `
                        <h3>${game.name}</h3>
                        <p>Players: ${game.minPlayers} - ${game.maxPlayers}</p>
                        <p>Category: ${game.category}</p>
                        <p>Rating: ${game.rating}</p>
                        <p>Owner: ${game.owner}</p>
                        <img src="${game.imageUrl}" alt="${game.name}" style="max-width:150px;">
                    `;
                    gamesList.appendChild(gameDiv);
                });
            }
        })
        .catch(error => {
            console.error("Error searching games:", error);
            document.getElementById("games-list").innerHTML = "<p>Error loading games!</p>";
        });
}
