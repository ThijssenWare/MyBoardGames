// Import necessary dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Use bodyParser to parse incoming request bodies as JSON
app.use(bodyParser.json());

// CORS configuration to allow cross-origin requests
app.use(cors({
  origin: [
    "https://thijssenware.github.io",   // GitHub Pages URL for the frontend
    "https://thijssenware.github.io/MyBoardGames",  // Specific repo URL
    "http://localhost:5500",  // Local development URL for frontend
    "https://myboardgames-backend.onrender.com",  // API backend URL when deployed (replace with your actual URL)
    "null" // Handle cases where the origin is 'null'
  ],
}));

// Initialize PostgreSQL client with connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Use your actual database URL here
  ssl: {
    rejectUnauthorized: false  // Important for Heroku/Render SSL configuration
  }
});

// Utility function for verifying JWT tokens
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Access denied');
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;  // Attach user to the request object
    next();
  });
}

// Route for user registration (with hashed password)
app.post('/api/register', async (req, res) => {
  const { username, password, household_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, household_id) VALUES ($1, $2, $3) RETURNING id',
      [username, hashedPassword, household_id]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route for user login (JWT token-based authentication)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).send('User not found');
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(400).send('Invalid password');
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route for getting a list of all games (example)
app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route for adding a new game to the collection (example)
app.post('/api/games', verifyToken, async (req, res) => {
  const { name, language, rating, lastplayed, minplayers, maxplayers, bggurl, imageurl, tag } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO games (name, language, rating, lastplayed, minplayers, maxplayers, bggurl, imageurl, tag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [name, language, rating, lastplayed, minplayers, maxplayers, bggurl, imageurl, tag]
    );
    res.status(201).json({ gameId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route for updating a game's information (example)
app.put('/api/games/:id', verifyToken, async (req, res) => {
  const gameId = req.params.id;
  const { name, language, rating, lastplayed, minplayers, maxplayers, bggurl, imageurl, tag } = req.body;

  try {
    const result = await pool.query(
      'UPDATE games SET name = $1, language = $2, rating = $3, lastplayed = $4, minplayers = $5, maxplayers = $6, bggurl = $7, imageurl = $8, tag = $9 WHERE id = $10',
      [name, language, rating, lastplayed, minplayers, maxplayers, bggurl, imageurl, tag, gameId]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('Game not found');
    }
    res.status(200).send('Game updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route for deleting a game (example)
app.delete('/api/games/:id', verifyToken, async (req, res) => {
  const gameId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM games WHERE id = $1', [gameId]);
    if (result.rowCount === 0) {
      return res.status(404).send('Game not found');
    }
    res.status(200).send('Game deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route for rating a game (example)
app.post('/api/ratings', verifyToken, async (req, res) => {
  const { game_id, score, comment } = req.body;
  const user_id = req.user.userId;  // User from JWT token

  try {
    const result = await pool.query(
      'INSERT INTO ratings (game_id, user_id, score, comment) VALUES ($1, $2, $3, $4) RETURNING id',
      [game_id, user_id, score, comment]
    );
    res.status(201).json({ ratingId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route for getting a user's ratings (example)
app.get('/api/ratings/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM ratings WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Start the server on the specified port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
