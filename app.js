// app.js - Frontend JavaScript to interact with the API

const apiUrl = "https://myboardgames-backend.onrender.com/api";  // Change to your actual backend URL

// Fetch games from the backend and display them on the front page
async function fetchGames() {
  try {
    const response = await fetch(`${apiUrl}/games`);
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }

    const games = await response.json();
    displayGames(games);
  } catch (error) {
    console.error('Error fetching games:', error);
  }
}

// Display the list of games on the homepage
function displayGames(games) {
  const gameListElement = document.getElementById('game-list');
  gameListElement.innerHTML = '';  // Clear the list

  games.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.classList.add('game-card');
    
    gameCard.innerHTML = `
      <img src="${game.imageurl || 'default-image.jpg'}" alt="${game.name}">
      <h3>${game.name}</h3>
      <p>Rating: ${game.rating || 'Not rated'}</p>
      <p><a href="/game/${game.id}">Details</a></p>
    `;
    
    gameListElement.appendChild(gameCard);
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  fetchGames();  // Fetch and display the list of games when the page is loaded
});
