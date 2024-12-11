// scripts/loggedInView.js

function renderLoggedInView() {
    // Render filters for logged-in users (with game owner filter)
    renderFilters(true);
    
    // Add additional functionality for adding, editing, and removing games
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Game';
    addButton.onclick = () => {
      alert('Add game logic goes here');
    };
    
    const gameListContainer = document.getElementById('game-list');
    gameListContainer.appendChild(addButton);
    
    // Render the game list (logged-in users may have additional permissions)
    loadGames();
  }
  
  // Call renderLoggedInView for logged-in view
  renderLoggedInView();
  