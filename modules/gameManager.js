// gameManager.js
export async function fetchGames(filters = {}) {
    // Mock API call - replace with actual fetch/axios call
    const games = [
        { name: 'Catan', category: ['Board Game'], minPlayers: 3, maxPlayers: 4, rating: 8, imageUrl: 'https://example.com/catan.jpg' },
        { name: 'Uno', category: ['Card Game'], minPlayers: 2, maxPlayers: 10, rating: 7, imageUrl: 'https://example.com/uno.jpg' }
    ];
    
    // Filter games based on provided filters (if any)
    return games.filter(game => {
        if (filters.category && !game.category.includes(filters.category)) return false;
        if (filters.tag && !game.tag.includes(filters.tag)) return false;
        return true;
    });
}

export async function addGame(game) {
    // Mock API call - replace with actual logic to add the game
    console.log('Game Added:', game);
}
