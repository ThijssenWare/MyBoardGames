// backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const gamesRoutes = require('./routes/games'); // Import game routes

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    "https://thijssenware.github.io",
    "https://thijssenware.github.io/MyBoardGames",
    "http://localhost:5500",
    "https://myboardgames-backend.onrender.com",
    "null"
  ],
}));
app.use(express.json());

// API Routes
app.use('/api/games', gamesRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
