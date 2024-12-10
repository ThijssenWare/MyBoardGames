// Replace with your Render backend URL
const backendUrl = "https://myboardgames-backend.onrender.com";

// Global variable to store all games
window.allGames = [];

// Wait for DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    fetchGames();
    fetchCategories();
    setupSearch();
});

// Fetch and display all games
function fetchGames() {
    fetch(`${backendUrl}/api/games`)
        .then(response => response.json())
        .then(data => {
            window.allGames = data; // Store games globally
            displayGames(data);
        })
        .catch(error => console.error('Error fetching games:', error));
}

// Function to fetch and display categories in the multi-select dropdown
function fetchCategories() {
    fetch(`${backendUrl}/api/categories`)
      .then((response) => response.json())
      .then((categories) => {
        const categorySelect = document.getElementById('category-select');
        const optionsContainer = categorySelect.querySelector('.multi-select-options');
        optionsContainer.innerHTML = '';
  
        categories.forEach((category) => {
          const optionDiv = document.createElement('div');
          optionDiv.classList.add('multi-select-option');
          optionDiv.innerHTML = `
            <input type="checkbox" class="multi-select-checkbox" value="${category.id}" id="cat-${category.id}">
            <label for="cat-${category.id}">${category.name}</label>
          `;
          optionsContainer.appendChild(optionDiv);
        });
  
        // Toggle dropdown visibility
        const header = categorySelect.querySelector('.multi-select-header');
        header.addEventListener('click', () => {
          optionsContainer.style.display = optionsContainer.style.display === 'none' ? 'block' : 'none';
        });
  
        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
          if (!categorySelect.contains(event.target)) {
            optionsContainer.style.display = 'none';
          }
        });
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }
  
  // Call fetchCategories when the DOM loads
  document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
  });
  

// Display games in the list
function displayGames(games) {
    const gamesList = document.getElementById("games-list");
    gamesList.innerHTML = ""; // Clear list

    games.forEach(game => {
        const gameDiv = document.createElement("div");

        gameDiv.innerHTML = `
            <h3>${game.name}</h3>
            <p>Players: ${game.minplayers} - ${game.maxplayers}</p>
            <p>Category: ${game.categories.join(", ")}</p>
            <p>Tag: ${game.tag}</p>
            <p>Rating: ${game.rating}</p>
            <button class="edit-game" data-id="${game.id}">Edit</button>
            <button class="delete-game" data-id="${game.id}">Delete</button>
        `;

        // Append to list
        gamesList.appendChild(gameDiv);
    });

    // Attach edit and delete handlers
    document.querySelectorAll(".edit-game").forEach(button => {
        button.addEventListener("click", () => openEditModal(button.dataset.id));
    });

    document.querySelectorAll(".delete-game").forEach(button => {
        button.addEventListener("click", () => deleteGame(button.dataset.id));
    });
}

// Open the edit modal and populate fields
function openEditModal(gameId) {
    const game = window.allGames.find(g => g.id == gameId);
    if (!game) return;

    // Populate fields
    document.getElementById("edit-name").value = game.name;
    document.getElementById("edit-minPlayers").value = game.minplayers;
    document.getElementById("edit-maxPlayers").value = game.maxplayers;
    document.getElementById("edit-category").value = game.category;
    document.getElementById("edit-language").value = game.language;
    document.getElementById("edit-rating").value = game.rating;
    document.getElementById("edit-lastPlayed").value = game.lastplayed;
    document.getElementById("edit-owner").value = game.owner;
    document.getElementById("edit-tag").value = game.tag;
    document.getElementById("edit-imageUrl").value = game.imageurl;

    // Save changes on form submit
    document.getElementById("edit-game-form").onsubmit = event => {
        event.preventDefault();
        saveGameChanges(gameId);
    };

    // Show modal
    document.getElementById("edit-modal").style.display = "block";
}

// Save changes to game
function saveGameChanges(gameId) {
    const updatedGame = {
        name: document.getElementById("edit-name").value,
        minplayers: document.getElementById("edit-minPlayers").value,
        maxplayers: document.getElementById("edit-maxPlayers").value,
        category: document.getElementById("edit-category").value,
        language: document.getElementById("edit-language").value,
        rating: document.getElementById("edit-rating").value,
        lastplayed: document.getElementById("edit-lastPlayed").value,
        owner: document.getElementById("edit-owner").value,
        tag: document.getElementById("edit-tag").value,
        imageurl: document.getElementById("edit-imageUrl").value
    };

    fetch(`${backendUrl}/api/games/${gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedGame)
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to update game");
            return response.json();
        })
        .then(() => {
            alert("Game updated successfully!");
            fetchGames(); // Refresh list
            closeEditModal();
        })
        .catch(error => console.error("Error updating game:", error));
}

// Function to delete a game
function deleteGame(gameId) {
    fetch(`${backendUrl}/api/games/${gameId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete game');
        alert('Game deleted successfully!');
        fetchGames(); // Refresh the game list
      })
      .catch((error) => {
        console.error('Error deleting game:', error);
        alert('Error deleting game');
      });
  }
  
  // Add delete button to each game in displayGames function
  function displayGames(games) {
    const gamesList = document.getElementById('games-list');
    gamesList.innerHTML = '';
  
    games.forEach((game) => {
      const gameDiv = document.createElement('div');
      gameDiv.innerHTML = `
        <h2>${game.name}</h2>
        <p>Players: ${game.minPlayers || 'N/A'} - ${game.maxPlayers || 'N/A'}</p>
        <p>Categories: ${game.categories.join(', ')}</p>
        <p>Rating: ${game.rating || 'N/A'}</p>
        <p>Owner: ${game.owner}</p>
        <img src="${game.imageUrl}" alt="${game.name}" style="max-width:150px;">
        <button onclick="editGame('${game.id}')">Edit</button>
        <button onclick="deleteGame('${game.id}')">Delete</button>
      `;
      gamesList.appendChild(gameDiv);
    });
  }
  

// Close the edit modal
function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();

        const filteredGames = window.allGames.filter(game =>
            game.name.toLowerCase().includes(searchTerm) ||
            game.categories.some(cat => cat.toLowerCase().includes(searchTerm)) ||
            game.tag.toLowerCase().includes(searchTerm)
        );

        displayGames(filteredGames);
    });
}
