import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';


function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError('');
    
    try {
      const result = await authService.login(formData.email, formData.password);
      
      if (result.success) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(result.message || 'Невірний email або пароль');
      }
    } catch (err) {
      setError(err.message || 'Помилка входу. Спробуйте ще раз.');
      console.error(err);
    } finally {
      setLoading(false);
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Завантаження...' : 'Увійти'}
          </button>
        </form>
        <p className="signup-link">
          Ще немає аккаунта? <a href="/signup">Зареєструватися</a>
        </p>
        <button 
          className="home-button"
          onClick={goToHomePage}
          disabled={loading}
        >
          На головну
        </button>
      </div>
    </div>
  );
}

export default Login;