// scripts/gamelist.js

// Reference to the main game list container
const gameListContainer = document.getElementById('game-list');

// Render the game list container and search bar dynamically
function renderGameList() {
  gameListContainer.innerHTML = `
    <!-- Search Bar -->
    <div id="search-bar">
      <label for="search">Search:</label>
      <input type="text" id="search" placeholder="Search games...">
    </div>

    <h2>All Games</h2>
    <ul id="games-container">
      <!-- Games will be dynamically loaded here -->
    </ul>
    <div id="loading" style="display: none;">Loading more games...</div>
  `;

  // Attach event listeners for search functionality
  setupSearchEventListener();
}

// Attach event listener for search input
function setupSearchEventListener() {
  const searchInput = document.getElementById('search');

  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    filterGamesBySearch(query);
  });
}

// Filter games based on the search query
function filterGamesBySearch(query) {
  const gameItems = document.querySelectorAll('.game-item');

  gameItems.forEach((game) => {
    const gameName = game.querySelector('h3').textContent.toLowerCase();
    if (gameName.includes(query)) {
      game.style.display = '';
    } else {
      game.style.display = 'none';
    }
  });
}

// Call renderGameList when the page loads
renderGameList();
