// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000; // You can choose any port

// Enable CORS for all origins
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// PostgreSQL Connection Pool Configuration
// IMPORTANT: Replace with your actual PostgreSQL credentials
const pool = new Pool({
    user: 'postgres',
    host: 'localhost', // e.g., 'localhost' or an IP address
    database: '26sql', // Your database name
    password: 'postgres',
    port: 5432, // Default PostgreSQL port
});

// Test the database connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database!');
    release(); // Release the client back to the pool
});

// --- API Endpoints ---

// Example 1: Get overall statistics
app.get('/api/stats', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM compute_statistics();');
        res.json(result.rows[0]); // Assuming compute_statistics returns one row
    } catch (err) {
        console.error('Error fetching statistics:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Example 2: Get category summaries
app.get('/api/categories/summary', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM category_summaries();');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching category summaries:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Example 3: Get recent operations log
app.get('/api/recent-operations', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM recent_operations_log;');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching recent operations:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// You can add more endpoints for other queries (outliers, top 5, etc.)

// Start the server
app.listen(port, () => {
    console.log(`Backend API listening at http://localhost:${port}`);
});
