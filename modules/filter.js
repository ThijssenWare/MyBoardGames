// filter.js
export function toggleAddGameForm() {
    const form = document.getElementById('add-game-form-container');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

export function initializeCategoryFilter(categoryFilter) {
    // Fetch and populate categories dynamically
    const categories = ['Board Game', 'Card Game', 'Strategy', 'Family'];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

export function initializeTagFilter(tagFilter) {
    // Fetch and populate tags dynamically
    const tags = ['2-Player', 'Cooperative', 'Solo', 'Party'];
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}
