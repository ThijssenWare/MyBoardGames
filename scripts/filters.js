// scripts/filters.js

// Reference to the filters container
const filtersContainer = document.getElementById('filters');

// Render the filters UI dynamically
function renderFilters(isLoggedIn) {
  filtersContainer.innerHTML = `
    <h2>Filters</h2>
    
    <!-- Mode Dropdown -->
    <label for="mode-select">Mode:</label>
    <select id="mode-select">
      <option value="cooperative">Cooperative</option>
      <option value="competitive">Competitive</option>
      <option value="other">Other</option>
    </select>

    <!-- Category Dropdown -->
    <label for="category-select">Categories:</label>
    <select id="category-select" multiple>
      <option value="deckbuilder">Deckbuilder</option>
      <option value="party">Party</option>
      <option value="family">Family</option>
      <!-- More categories can be added here -->
    </select>

    <!-- Players Range -->
    <h3>Number of Players</h3>
    <label for="min-players">Min Players:</label>
    <input type="range" id="min-players" min="1" max="10" step="1" value="1">
    <span id="min-player-count">1</span>
    
    <label for="max-players">Max Players:</label>
    <input type="range" id="max-players" min="1" max="10" step="1" value="10">
    <span id="max-player-count">10</span>
  `;

  // Only show the Game Owners filter if the user is logged in
  if (isLoggedIn) {
    filtersContainer.innerHTML += `
      <!-- Game Owners Dropdown -->
      <h3>Game Owners</h3>
      <label for="game-owner-select">Game Owner:</label>
      <select id="game-owner-select">
        <option value="owner1">Owner 1</option>
        <option value="owner2">Owner 2</option>
        <option value="owner3">Owner 3</option>
        <!-- More owners can be added here -->
      </select>
    `;
  }

  // Attach event listeners after rendering the filters
  setupFilterEventListeners();
}

// Attach event listeners for filter logic
function setupFilterEventListeners() {
  // Update the range display dynamically for min-players
  const minPlayerRange = document.getElementById('min-players');
  const minPlayerCount = document.getElementById('min-player-count');
  minPlayerRange.addEventListener('input', () => {
    minPlayerCount.textContent = minPlayerRange.value;
  });

  // Update the range display dynamically for max-players
  const maxPlayerRange = document.getElementById('max-players');
  const maxPlayerCount = document.getElementById('max-player-count');
  maxPlayerRange.addEventListener('input', () => {
    maxPlayerCount.textContent = maxPlayerRange.value;
  });
}

// You can call renderFilters with `true` or `false` based on login state.
// For example:
// renderFilters(true);  // Logged in view, includes game owner filter
// renderFilters(false); // Home view, no game owner filter
