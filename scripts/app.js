// scripts/app.js

// References
const gamesContainer = document.getElementById('games-container');
const loadingIndicator = document.getElementById('loading');

let currentPage = 1;
const pageSize = 20;

// Fetch games mock data
function fetchGames(page, size, filters = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const games = [];
      for (let i = 1; i <= size; i++) {
        const gameId = (page - 1) * size + i;
        games.push({
          id: gameId,
          name: `Game ${gameId}`,
          rating: (Math.random() * 5).toFixed(1),
          image: 'images/placeholder.jpg',
          category: 'strategy',
        });
      }
      resolve(games);
    }, 1000);
  });
}

// Render games to the DOM
function renderGames(games) {
  games.forEach((game) => {
    const listItem = document.createElement('li');
    listItem.classList.add('game-item');
    listItem.innerHTML = `
      <img src="${game.image}" alt="Game Image">
      <div class="game-info">
        <h3>${game.name}</h3>
        <p>Rating: ${game.rating}</p>
        <a href="pages/game-details.html?id=${game.id}">View Details</a>
      </div>
    `;
    gamesContainer.appendChild(listItem);
  });
}

// Load games dynamically
async function loadGames() {
  loadingIndicator.style.display = 'block';
  const games = await fetchGames(currentPage, pageSize);
  renderGames(games);
  loadingIndicator.style.display = 'none';
  currentPage++;
}

// Infinite scroll logic
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
    loadGames();
  }
});

// scripts/app.js

let isLoggedIn = false;  // Default is logged out

// Add event listener for the toggle button
const toggleButton = document.getElementById('toggle-login');
toggleButton.addEventListener('click', () => {
  isLoggedIn = !isLoggedIn;  // Toggle the login state

  // Call the appropriate function to render the correct view
  if (isLoggedIn) {
    renderLoggedInView();
  } else {
    renderHomeView();
  }

  // Optionally change the button text to reflect the current state
  toggleButton.textContent = isLoggedIn ? 'Switch to Logged Out' : 'Switch to Logged In';
});

// Initial render based on the current logged-in state
if (isLoggedIn) {
  renderLoggedInView();
} else {
  renderHomeView();
}


// Initial load
loadGames();
