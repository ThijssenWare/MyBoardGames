import { toggleAddGameForm, initializeCategoryFilter, initializeTagFilter } from './modules/filter.js';
import { fetchGames, addGame } from './modules/gameManager.js';
import { populateCategories, populateTags } from './modules/populateSelectOptions.js';

// DOM elements
const toggleAddGameButton = document.getElementById('toggle-add-game');
const addGameFormContainer = document.getElementById('add-game-form-container');
const addGameForm = document.getElementById('add-game-form');
const categoryFilter = document.getElementById('category-filter');
const tagFilter = document.getElementById('tag-filter');
const gamesListContainer = document.getElementById('games-list');

// Event listeners
toggleAddGameButton.addEventListener('click', toggleAddGameForm);
addGameForm.addEventListener('submit', handleAddGame);
categoryFilter.addEventListener('change', handleFilterChange);
tagFilter.addEventListener('change', handleFilterChange);

// Initialize game-related data
initializeCategoryFilter(categoryFilter);
initializeTagFilter(tagFilter);

// Load and display games
function displayGames(games) {
    gamesListContainer.innerHTML = games.map(game => {
        return `
            <div class="game-card">
                <h3>${game.name}</h3>
                <p>Category: ${game.category.join(', ')}</p>
                <p>Players: ${game.minPlayers} - ${game.maxPlayers}</p>
                <p>Rating: ${game.rating}</p>
                <img src="${game.imageUrl}" alt="${game.name} image" />
            </div>
        `;
    }).join('');
}

// Handle Add Game Form submission
async function handleAddGame(event) {
    event.preventDefault();
    
    const newGame = {
        name: document.getElementById('name').value,
        minPlayers: parseInt(document.getElementById('minPlayers').value),
        maxPlayers: parseInt(document.getElementById('maxPlayers').value),
        category: [...document.getElementById('category').selectedOptions].map(option => option.value),
        tag: document.getElementById('tag').value,
        language: document.getElementById('language').value,
        rating: parseFloat(document.getElementById('rating').value),
        lastPlayed: document.getElementById('lastPlayed').value,
        owner: document.getElementById('owner').value,
        BGGUrl: document.getElementById('BGGUrl').value,
        imageUrl: document.getElementById('imageUrl').value
    };
    
    await addGame(newGame);
    displayGames(await fetchGames());
}

// Handle filters change
async function handleFilterChange() {
    const filteredGames = await fetchGames({
        category: categoryFilter.value,
        tag: tagFilter.value
    });
    displayGames(filteredGames);
}

// Initial fetch and display of games
(async () => {
    const games = await fetchGames();
    displayGames(games);
    populateCategories();
    populateTags();
})();
