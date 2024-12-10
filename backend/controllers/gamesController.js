// backend/controllers/gamesController.js
const gameModel = require('../models/gameModel');

exports.getAllGames = async (req, res) => {
    try {
        const games = await gameModel.getAll(req.query);
        res.json(games);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.addGame = async (req, res) => {
    try {
        const newGame = await gameModel.add(req.body);
        res.status(201).json(newGame);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.updateGame = async (req, res) => {
    try {
        const updatedGame = await gameModel.update(req.params.id, req.body);
        res.json(updatedGame);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.deleteGame = async (req, res) => {
    try {
        await gameModel.remove(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
