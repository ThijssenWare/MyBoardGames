// backend/server.js

const express = require('express');
const { Pool } = require('pg'); // PostgreSQL client for Node.js
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000; // Port for server, default to 3000 for local dev

app.use(cors({
    origin: [
      "https://thijssenware.github.io", // GitHub Pages URL
      "http://localhost:5500",          // Local testing URL (if using VS Code Live Server or another local server)
    ],
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
  }));

// Middleware to parse JSON bodies
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Fetch database connection URL from .env
  ssl: {
    rejectUnauthorized: false, // Disable SSL validation for self-signed certificates (common in cloud environments)
  },
});

// Route for fetching all games
app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games');
    res.json(result.rows); // Send all games from the database as JSON response
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Adding a new game
app.post('/api/games', async (req, res) => {
    const { name, minPlayers, maxPlayers, category, language, rating, lastPlayed, owner, BGGUrl, tag, imageUrl } = req.body;

    // Validation
    if (!name || !minPlayers || !maxPlayers || !category || !language || !owner || !BGGUrl || !tag || !imageUrl) {
        return res.status(400).json({ error: "All fields except 'lastPlayed' and 'rating' are required." });
    }

    try {
        const result = await pool.query(
            'INSERT INTO games (name, minPlayers, maxPlayers, category, language, rating, lastPlayed, owner, BGGUrl, tag, imageUrl) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [name, minPlayers, maxPlayers, category, language, rating || null, lastPlayed || null, owner, BGGUrl, tag, imageUrl]
        );
        res.status(201).json(result.rows[0]);  // Send the newly added game as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update game
app.put('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    const { name, minPlayers, maxPlayers, category, language, rating, lastPlayed, owner, BGGUrl, tag, imageUrl } = req.body;
    
    try {
      const result = await pool.query(
        `UPDATE games SET name = $1, minPlayers = $2, maxPlayers = $3, category = $4, language = $5, 
         rating = $6, lastPlayed = $7, owner = $8, BGGUrl = $9, tag = $10, imageUrl = $11 WHERE id = $12 RETURNING *`,
        [name, minPlayers, maxPlayers, category, language, rating, lastPlayed, owner, BGGUrl, tag, imageUrl, id]
      );
      res.json(result.rows[0]); // Return updated game
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  // Delete game
  app.delete('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM games WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        return res.status(404).send('Game not found');
      }
      res.status(204).send(); // Return no content on successful deletion
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  

// Search and filter
app.get('/api/games', async (req, res) => {
    const { name, category, minPlayers, maxPlayers, rating } = req.query;
    let query = 'SELECT * FROM games WHERE 1=1';
    const values = [];
  
    if (name) {
      query += ' AND name ILIKE $' + (values.length + 1);
      values.push(`%${name}%`);
    }
    if (category) {
      query += ' AND category ILIKE $' + (values.length + 1);
      values.push(`%${category}%`);
    }
    if (minPlayers) {
      query += ' AND minPlayers >= $' + (values.length + 1);
      values.push(minPlayers);
    }
    if (maxPlayers) {
      query += ' AND maxPlayers <= $' + (values.length + 1);
      values.push(maxPlayers);
    }
    if (rating) {
      query += ' AND rating >= $' + (values.length + 1);
      values.push(rating);
    }
  
    try {
      const result = await pool.query(query, values);
      res.json(result.rows); // Send filtered games as response
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
