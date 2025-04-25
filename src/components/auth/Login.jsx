import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const goToHomePage = () => {
    navigate('/');
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/login', formData);
      if (response.data.success) {
        // Store user info in localStorage or context
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Redirect to dashboard instead of home page
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Невірний email або пароль');
      }
    } catch (err) {
      setError('Помилка входу. Спробуйте ще раз.');
      console.error(err);
    }
    
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2>Вхід в аккаунт</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">Увійти</button>
        </form>
        <p className="signup-link">
          Ще немає аккаунта? <a href="/signup">Зареєструватися</a>
        </p>
        <button 
          className="home-button"
          style={{
            position: 'absolute',
            top: '90px',
            left: '882px',
            padding: '20px 30px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: 1000 // Ensure button is above canvas
          }}
          onClick={goToHomePage}
        >
          На головну
        </button>
      </div>
    </div>
  );
}

export default Login;