import React from 'react';
import { useAuth } from '../features/auth/userauth';
import { authAPI } from '../features/auth/auth.api';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    authAPI.logout();
    logout();
    navigate('/login');
  };

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1>🎉 Welcome to HuzzAI Dashboard!</h1>
        <p>Congratulations! You've successfully completed the onboarding process.</p>
        
        {auth?.user && (
          <div style={{ marginBottom: '30px' }}>
            <h2>Hello, {auth.user.first_name} {auth.user.last_name}!</h2>
            <p>Email: {auth.user.email}</p>
          </div>
        )}
        
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <h3>Your AI-powered dating assistant is ready!</h3>
          <p>Your preferences have been saved and your personalized experience is being prepared.</p>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
