const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://fishinggame-2-backend.onrender.com/api' // Заміни на твій backend URL
  : 'http://localhost:3001/api';

export const authService = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    return await res.json();
  },

  signup: async (username, email, password) => {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include'
    });
    return await res.json();
  }
};
