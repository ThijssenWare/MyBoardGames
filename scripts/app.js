// /scripts/app.js

import { Header } from '../components/header.js';
import { Filters } from '../components/filters.js';

function renderHomePage() {
    document.getElementById('home').innerHTML = `
        <h1>My Board Games</h1>
        <div id="game-list">
            <!-- Dynamically populated games will go here -->
        </div>
    `;
}

function renderGameDetailPage() {
    document.getElementById('game-detail').innerHTML = `
        <h1>Game Detail</h1>
        <div id="game-details">
            <!-- Game details will go here -->
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", function () {
    const header = new Header();
    header.render();

    const filters = new Filters();
    filters.render();

    // Basic routing based on URL hash
    if (window.location.hash === '#gameDetail') {
        renderGameDetailPage();
    } else {
        renderHomePage();
    }
});
