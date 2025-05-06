const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Підключення до CockroachDB
const pool = new Pool({
  connectionString: 'postgresql://Adminroman:lC0mQQ4A32Tus7IMk9iJ7Q@decent-caribou-11034.j77.aws-eu-central-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full'
});

// Тест підключення
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Помилка підключення до CockroachDB:', err.stack);
  }
  console.log('Підключено до CockroachDB');
  release();
});

// Реєстрація
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Будь ласка, заповніть усі поля' });
  }

  try {
    const client = await pool.connect();

    // Перевірка чи існує email
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      client.release();
      return res.status(400).json({ success: false, message: 'Користувач з таким email вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Додавання користувача
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

// Логін
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

// Старт сервера
app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
