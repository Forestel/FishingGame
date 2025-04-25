import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/common.css';
import './styles/reset.css';
import { AuthProvider } from './components/auth/context/AuthContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);