// backend/routes/games.js
const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');

// Fetch all games with optional query params for filtering
router.get('/', gamesController.getAllGames);

// Add a new game
router.post('/', gamesController.addGame);

// Update a game by its ID
router.put('/:id', gamesController.updateGame);

// Delete a game by its ID
router.delete('/:id', gamesController.deleteGame);

module.exports = router;
