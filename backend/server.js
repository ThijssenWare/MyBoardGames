// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const gamesRoutes = require('./routes/games');
const categoriesRoutes = require('./routes/categories');

dotenv.config();

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
app.use('/api/categories', categoriesRoutes);

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
