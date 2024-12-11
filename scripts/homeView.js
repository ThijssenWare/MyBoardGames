// scripts/homeView.js

function renderHomeView() {
    // Render filters for non-logged-in users (no game owner filter)
    renderFilters(false);
    
    // Render the game list
    loadGames();
  }
  
  // Call renderHomeView for home view (non-logged-in)
  renderHomeView();
  