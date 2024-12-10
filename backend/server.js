// backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const gamesRoutes = require('./routes/games'); // Import game routes
const categoriesRoutes = require('./routes/categories'); // Import categories routes

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
app.use('/api/categories', categoriesRoutes); // Add categories routes for /api/categories

// Handle 404 errors (for routes not defined)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
