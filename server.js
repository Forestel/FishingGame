const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Add dotenv for environment variables

const app = express();
// Use environment variable for port to work with Render
const PORT = process.env.PORT || 3001;

// Configure CORS for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL  // Your frontend URL on Render
    : 'http://localhost:3000',  // Local development
  credentials: true
}));

app.use(bodyParser.json());

// CockroachDB connection using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for connecting to CockroachDB Cloud
  }
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to CockroachDB:', err.stack);
  }
  console.log('Connected to CockroachDB successfully');
  release();
});

// Create users table if it doesn't exist
const initializeDb = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized');
    client.release();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

initializeDb();

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Будь ласка, заповніть усі поля' });
  }

  try {
    const client = await pool.connect();
    
    // Check if email already exists
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      client.release();
      return res.status(400).json({ success: false, message: 'Користувач з таким email вже існує' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Add user
    await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );
    
    client.release();
    
    res.json({ success: true, message: 'Реєстрація успішна' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Помилка при реєстрації' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Будь ласка, заповніть усі поля' });
  }

  try {
    const client = await pool.connect();
    
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      client.release();
      return res.status(401).json({ success: false, message: 'Невірний email або пароль' });
    }
    
    const user = result.rows[0];
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      client.release();
      return res.status(401).json({ success: false, message: 'Невірний email або пароль' });
    }
    
    client.release();
    
    res.json({
      success: true,
      message: 'Вхід успішний',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Помилка входу' });
  }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});