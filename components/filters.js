// /components/filters.js
class Filters {
    constructor() {
        this.filtersElement = document.getElementById('filters');
    }

    render() {
        this.filtersElement.innerHTML = `
            <h3>Filters</h3>
            <label for="language">Language</label>
            <select id="language">
                <option value="any">Any</option>
                <option value="english">English</option>
                <option value="dutch">Dutch</option>
            </select>
            <label for="players">Min/Max Players</label>
            <input type="range" id="players" min="1" max="10">
            <button id="apply-filters">Apply Filters</button>
        `;
    }
}

const filters = new Filters();
filters.render();
