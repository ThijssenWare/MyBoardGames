// Replace with your Render backend URL
const backendUrl = "https://myboardgames-backend.onrender.com"; // Ensure "https" is correct here

document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display games
    fetchGames();

    // Testing bit: Form to add a new game
    setupTestingForm();
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
                    gameDiv.innerHTML = `
                        <h2>${game.name}</h2>
                        <p>Players: ${game.minplayers} - ${game.maxplayers}</p>
                        <p>Category: ${game.category}</p>
                        <p>Rating: ${game.rating || "N/A"}</p>
                        <p>Owner: ${game.owner}</p>
                        <img src="${game.imageurl}" alt="${game.name}" style="max-width:150px;">
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
