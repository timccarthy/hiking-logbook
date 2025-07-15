const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

app.get('/api/logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM logs ORDER BY date DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

app.post('/api/logs', async (req, res) => {
  const { date, log_entry, user_id } = req.body;
  if (!date || !log_entry || log_entry.length > 1000) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO logs (date, log_entry, user_id) VALUES ($1, $2, $3) RETURNING *',
      [date, log_entry, user_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save log' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
