// /scripts/app.js

import { Header } from '../components/header.js';
import { Filters } from '../components/filters.js';

function renderHomePage() {
    console.log("Rendering home page...");
    document.getElementById('home').innerHTML = `
        <h1>My Board Games</h1>
        <div id="game-list">
            <!-- Dynamically populated games will go here -->
        </div>
    `;
}

function renderGameDetailPage() {
    console.log("Rendering game detail page...");
    document.getElementById('game-detail').innerHTML = `
        <h1>Game Detail</h1>
        <div id="game-details">
            <!-- Game details will go here -->
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("App loaded and running!");

    const header = new Header();
    console.log("Rendering header...");
    header.render();

    const filters = new Filters();
    console.log("Rendering filters...");
    filters.render();

    // Basic routing based on URL hash
    if (window.location.hash === '#gameDetail') {
        renderGameDetailPage();
    } else {
        renderHomePage();
    }
});
