// populateSelectOptions.js
export function populateCategories() {
    const categories = ['Board Game', 'Card Game', 'Strategy', 'Family'];
    const categorySelect = document.getElementById('category');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

export function populateTags() {
    const tags = ['2-Player', 'Cooperative', 'Solo', 'Party'];
    const tagSelect = document.getElementById('tag');
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
    });
}
