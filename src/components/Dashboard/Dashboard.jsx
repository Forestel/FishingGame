import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    // Отримуємо дані користувача з localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    
    // Отримуємо статистику користувача з API
    const fetchUserStats = async () => {
      try {
        const token = JSON.parse(userData).token;
        const response = await axios.get('http://localhost:3001/api/user/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Помилка при отриманні статистики:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="dashboard-loading">Завантаження...</div>;
  }
  const goToHomePage = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="user-info">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h3>{user?.username || 'Користувач'}</h3>
          <p>{user?.email}</p>
        </div>
        
        <div className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Мій профіль
          </button>
          <button 
            className={`menu-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Статистика
          </button>
          <button 
            className={`menu-item ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            Історія ігор
          </button>
          <button 
            className="menu-item logout"
            onClick={handleLogout}
          >
            Вийти
          </button>
        </div>
      </div>
      <button 
          className="home-button"
          style={{
            position: 'absolute',
            top: '390px',
            left: '60px',
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
      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Особисті дані</h2>
            <div className="profile-info">
              <div className="info-group">
                <label>Ім'я користувача</label>
                <p>{user?.username}</p>
              </div>
              <div className="info-group">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>
              
            </div>
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div className="stats-section">
            <h2>Ваша статистика</h2>
            {stats ? (
              <div className="stats-cards">
                <div className="stat-card">
                  <h3>Зіграно ігор</h3>
                  <p className="stat-value">{stats.gamesPlayed || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Виловлено риби</h3>
                  <p className="stat-value">{stats.fishCaught || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Кращий результат</h3>
                  <p className="stat-value">{stats.bestScore || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Загальний час в грі</h3>
                  <p className="stat-value">{stats.totalPlayTime || 0} хв.</p>
                </div>
              </div>
            ) : (
              <p>Статистика поки що відсутня. Зіграйте свою першу гру!</p>
            )}
          </div>
        )}
        
        
        {activeTab === 'games' && (
          <div className="games-section">
            <h2>Історія ігор</h2>
            {stats && stats.gameHistory && stats.gameHistory.length > 0 ? (
              <table className="games-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Результат</th>
                    <th>Виловлено риби</th>
                    <th>Час гри</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.gameHistory.map((game, index) => (
                    <tr key={index}>
                      <td>{new Date(game.date).toLocaleDateString('uk-UA')}</td>
                      <td>{game.score}</td>
                      <td>{game.fishCaught}</td>
                      <td>{game.playTime} хв.</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Ви ще не зіграли жодної гри.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;