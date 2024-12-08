// backend/routes/games.js
const express = require('express');
const router = express.Router();

// Your database connection pool
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Get all games
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a new game
router.post('/', async (req, res) => {
  const { name, players, category, language, rating, last_played } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO games (name, players, category, language, rating, last_played) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, players, category, language, rating, last_played]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
