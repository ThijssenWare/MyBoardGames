// Replace with your Render backend URL
const backendUrl = "hhttps://myboardgames-backend.onrender.com"; 

document.addEventListener("DOMContentLoaded", () => {
    fetch(`${backendUrl}/api/games`)  // Connect to your backend API
        .then(response => response.json())
        .then(data => {
            const gamesList = document.getElementById("games-list");
            if (data.length === 0) {
                gamesList.innerHTML = "<p>No games found!</p>";
            } else {
                data.forEach(game => {
                    const gameDiv = document.createElement("div");
                    gameDiv.innerHTML = `
                        <h2>${game.name}</h2>
                        <p>Players: ${game.minPlayers} - ${game.maxPlayers}</p>
                        <p>Rating: ${game.rating || "N/A"}</p>
                    `;
                    gamesList.appendChild(gameDiv);
                });
            }
        })
        .catch(error => {
            console.error("Error fetching games:", error);
            document.getElementById("games-list").innerHTML = "<p>Error loading games!</p>";
        });
});
