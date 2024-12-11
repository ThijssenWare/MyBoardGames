// backend/models/gameModel.js
const pool = require('../config/db');

exports.getAll = async (query) => {
    const { name, category, minPlayers, maxPlayers, rating } = query;
    
    let queryStr = `
        SELECT g.*, ARRAY_AGG(c.name) AS categories
        FROM games g
        LEFT JOIN game_categories gc ON g.id = gc.game_id
        LEFT JOIN categories c ON gc.category_id = c.id
        WHERE 1=1
    `;
    const values = [];

    if (name) {
        queryStr += ` AND g.name ILIKE $${values.length + 1}`;
        values.push(`%${name}%`);
    }
    if (category) {
        queryStr += ` AND c.name ILIKE $${values.length + 1}`;
        values.push(`%${category}%`);
    }
    if (minPlayers) {
        queryStr += ` AND g.minPlayers >= $${values.length + 1}`;
        values.push(Number(minPlayers));
    }
    if (maxPlayers) {
        queryStr += ` AND g.maxPlayers <= $${values.length + 1}`;
        values.push(Number(maxPlayers));
    }
    if (rating) {
        queryStr += ` AND g.rating >= $${values.length + 1}`;
        values.push(Number(rating));
    }

    queryStr += ` GROUP BY g.id`;

    try {
        const result = await pool.query(queryStr, values);
        return result.rows;
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.add = async (gameData) => {
    const {
        name, minPlayers, maxPlayers, categoryIds, language, rating,
        lastPlayed, owner, BGGUrl, tag, imageUrl
    } = gameData;

    try {
        const gameResult = await pool.query(
            `INSERT INTO games (name, minPlayers, maxPlayers, language, rating, lastPlayed, owner, BGGUrl, tag, imageUrl)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [name, minPlayers, maxPlayers, language, rating || null, lastPlayed || null, owner, BGGUrl, tag, imageUrl]
        );

        const gameId = gameResult.rows[0].id;
        const categoryPromises = categoryIds.map(categoryId => 
            pool.query('INSERT INTO game_categories (game_id, category_id) VALUES ($1, $2)', [gameId, categoryId])
        );
        
        await Promise.all(categoryPromises);
        return gameResult.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.update = async (id, gameData) => {
    const {
        name, minPlayers, maxPlayers, categoryIds, language, rating,
        lastPlayed, owner, BGGUrl, tag, imageUrl
    } = gameData;

    try {
        await pool.query(
            `UPDATE games SET name = $1, minPlayers = $2, maxPlayers = $3, language = $4, rating = $5,
            lastPlayed = $6, owner = $7, BGGUrl = $8, tag = $9, imageUrl = $10 WHERE id = $11`,
            [name, minPlayers, maxPlayers, language, rating, lastPlayed, owner, BGGUrl, tag, imageUrl, id]
        );

        await pool.query('DELETE FROM game_categories WHERE game_id = $1', [id]);
        const categoryPromises = categoryIds.map(categoryId =>
            pool.query('INSERT INTO game_categories (game_id, category_id) VALUES ($1, $2)', [id, categoryId])
        );

        await Promise.all(categoryPromises);
        return { id, ...gameData };
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.remove = async (id) => {
    try {
        await pool.query('DELETE FROM game_categories WHERE game_id = $1', [id]);
        await pool.query('DELETE FROM games WHERE id = $1', [id]);
    } catch (err) {
        throw new Error(err.message);
    }
};
