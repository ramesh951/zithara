const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'zithara',
    password: 'pass',
    port: 5432,
});

const app = express();

app.get('/customers', async (req, res) => {
    const client = await pool.connect();
    //const result = await client.query('SELECT * FROM public.customers');
    const result = await client.query(`
    SELECT sno, name, age, phone, location,
    TO_CHAR(created_at, 'YYYY-MM-DD') AS date,
    TO_CHAR(created_at, 'HH24:MI:SS') AS time
    FROM public.customers
    `);

    const results = { 'results': (result) ? result.rows : null};
    res.send(results);
    client.release();
});

app.listen(8000, () => console.log('Listening on port 8000'));