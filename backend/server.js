// server.js

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const gamesRoutes = require('./routes/games'); // Correctly import the games route

// Create an instance of express
const app = express();

// Use middlewares
app.use(bodyParser.json());  // Parses incoming JSON requests
app.use(cors());  // Allows cross-origin requests, useful for connecting frontend and backend

// Register routes
app.use('/api/games', gamesRoutes); // Register the games route with the "/api/games" path prefix

// Define a simple route to check the server status
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// Set up the port for the server
const PORT = process.env.PORT || 5000;  // Default to 5000 if no environment variable is set
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
