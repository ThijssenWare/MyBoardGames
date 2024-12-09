// backend/routes/games.js

const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import the database connection

// Fetch all games or filtered games
router.get('/', async (req, res) => {
  const { name, category, minPlayers, maxPlayers, rating } = req.query;

  let query = 'SELECT * FROM games WHERE 1=1';
  const values = [];

  // Build dynamic filters
  if (name) {
    query += ` AND name ILIKE $${values.length + 1}`;
    values.push(`%${name}%`);
  }
  if (category) {
    query += ` AND category ILIKE $${values.length + 1}`;
    values.push(`%${category}%`);
  }
  if (minPlayers) {
    query += ` AND minPlayers >= $${values.length + 1}`;
    values.push(Number(minPlayers));
  }
  if (maxPlayers) {
    query += ` AND maxPlayers <= $${values.length + 1}`;
    values.push(Number(maxPlayers));
  }
  if (rating) {
    query += ` AND rating >= $${values.length + 1}`;
    values.push(Number(rating));
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a new game
router.post('/', async (req, res) => {
  const { name, minPlayers, maxPlayers, category, language, rating, lastPlayed, owner, BGGUrl, tag, imageUrl } = req.body;

  if (!name || !minPlayers || !maxPlayers || !category || !language || !owner || !BGGUrl || !tag || !imageUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      'INSERT INTO games (name, minPlayers, maxPlayers, category, language, rating, lastPlayed, owner, BGGUrl, tag, imageUrl) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, minPlayers, maxPlayers, category, language, rating || null, lastPlayed || null, owner, BGGUrl, tag, imageUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Other routes...

module.exports = router;
