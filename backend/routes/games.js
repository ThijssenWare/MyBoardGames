// routes/games.js

const express = require('express');
const router = express.Router();

// Define a basic route for GET /games
router.get('/', (req, res) => {
    res.json({ message: 'List of games' });
});

// Export the router to use in the server.js
module.exports = router;
