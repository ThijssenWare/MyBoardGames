// /scripts/app.js
import { Header } from '../components/header.js';
import { Filters } from '../components/filters.js';

document.addEventListener("DOMContentLoaded", function() {
    // Initialize Header and Filters on the Home page
    if (document.getElementById('header')) {
        const header = new Header();
        header.render();
    }

    if (document.getElementById('filters')) {
        const filters = new Filters();
        filters.render();
    }

    // Here we will later fetch and render games using API data
});
