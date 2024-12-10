// backend/routes/games.js

const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import the database connection

// Fetch all games or filtered games
router.get('/', async (req, res) => {
  const { name, category, minPlayers, maxPlayers, rating } = req.query;

  let query = `
    SELECT g.*, ARRAY_AGG(c.name) AS categories
    FROM games g
    LEFT JOIN game_categories gc ON g.id = gc.game_id
    LEFT JOIN categories c ON gc.category_id = c.id
    WHERE 1=1
  `;
  const values = [];

  // Build dynamic filters
  if (name) {
    query += ` AND g.name ILIKE $${values.length + 1}`;
    values.push(`%${name}%`);
  }
  if (category) {
    query += ` AND c.name ILIKE $${values.length + 1}`;
    values.push(`%${category}%`);
  }
  if (minPlayers) {
    query += ` AND g.minPlayers >= $${values.length + 1}`;
    values.push(Number(minPlayers));
  }
  if (maxPlayers) {
    query += ` AND g.maxPlayers <= $${values.length + 1}`;
    values.push(Number(maxPlayers));
  }
  if (rating) {
    query += ` AND g.rating >= $${values.length + 1}`;
    values.push(Number(rating));
  }

  query += ` GROUP BY g.id`;

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
  const {
    name,
    minPlayers,
    maxPlayers,
    categoryIds, // Now an array of category IDs
    language,
    rating,
    lastPlayed,
    owner,
    BGGUrl,
    tag,
    imageUrl,
  } = req.body;

  if (!name || !minPlayers || !maxPlayers || !categoryIds || !language || !owner || !BGGUrl || !tag || !imageUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate the language input
  const validLanguages = ['Dutch', 'English', 'Other'];
  if (!validLanguages.includes(language)) {
    return res.status(400).json({ error: 'Invalid language' });
  }

  try {
    // Insert the game into the `games` table
    const gameResult = await pool.query(
      `
      INSERT INTO games (name, minPlayers, maxPlayers, language, rating, lastPlayed, owner, BGGUrl, tag, imageUrl)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
      `,
      [name, minPlayers, maxPlayers, language, rating || null, lastPlayed || null, owner, BGGUrl, tag, imageUrl]
    );
    const gameId = gameResult.rows[0].id;

    // Insert into `game_categories` table for each category
    const categoryInsertPromises = categoryIds.map((categoryId) =>
      pool.query(
        'INSERT INTO game_categories (game_id, category_id) VALUES ($1, $2)',
        [gameId, categoryId]
      )
    );
    await Promise.all(categoryInsertPromises);

    res.status(201).json(gameResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
