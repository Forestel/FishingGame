const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware з покращеними налаштуваннями CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Fishing_Game',
});

// Connect to MySQL з покращеною обробкою помилок
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Додаємо кореневий маршрут
app.get('/', (req, res) => {
  res.send('API сервер працює нормально.');
});

// Sign up route з розширеним логуванням
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  
  console.log('Отримано запит на реєстрацію:', { username, email });

  // Validate input
  if (!username || !email || !password) {
    console.log('Відсутні обов\'язкові поля');
    return res.status(400).json({ 
      success: false, 
      message: 'Усі поля обов\'язкові' 
    });
  }

  try {
    // Check if email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Помилка сервера' 
        });
      }

      if (results.length > 0) {
        console.log('Email вже зареєстрований:', email);
        return res.status(400).json({ 
          success: false, 
          message: 'Email вже зареєстрований' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Пароль успішно хешовано');

      // Insert new user
      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ 
              success: false, 
              message: 'Помилка при створенні користувача' 
            });
          }
          
          console.log('Користувач успішно створений');
          return res.status(201).json({ 
            success: true, 
            message: 'Користувач успішно зареєстрований' 
          });
        }
      );
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Помилка сервера' 
    });
  }
});

// Login route з покращеним логуванням
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Отримано запит на вхід:', { email });

  // Validate input
  if (!email || !password) {
    console.log('Відсутні обов\'язкові поля для входу');
    return res.status(400).json({ 
      success: false, 
      message: 'Email та пароль обов\'язкові' 
    });
  }

  try {
    // Check if user exists
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Помилка сервера' 
          });
        }

        if (results.length === 0) {
          console.log('Користувача не знайдено:', email);
          return res.status(401).json({ 
            success: false, 
            message: 'Невірний email або пароль' 
          });
        }

        const user = results[0];

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          console.log('Невірний пароль для користувача:', email);
          return res.status(401).json({ 
            success: false, 
            message: 'Невірний email або пароль' 
          });
        }

        console.log('Успішний вхід користувача:', email);
        // Don't send password back to client
        const { password: userPassword, ...userWithoutPassword } = user;

        res.status(200).json({ 
          success: true, 
          message: 'Вхід успішний', 
          user: userWithoutPassword 
        });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Помилка сервера' 
    });
  }
});

// Додаємо маршрут для перевірки з'єднання
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    database: db.state === 'authenticated' ? 'connected' : 'disconnected'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});