import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from "./components/Header/Header";
import FishingGame from './components/FishingGame/FishingGame';
import Fish from './components/fish/Fish';
import Instruction from './components/Instruction/Instruction';
import Footer from './components/Footer/Footer';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Перевіряємо аутентифікацію при завантаженні
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);
  
  // Компонент для захищених маршрутів
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  
  // Оновлюємо статус аутентифікації при зміні localStorage
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!user);
    };
    
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Fish />
              <Instruction />
              <Footer />
            </>
          } />
          
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          } />
          
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />
          } />
          
          <Route path="/fishing-game" element={
            <ProtectedRoute>
              <FishingGame />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;