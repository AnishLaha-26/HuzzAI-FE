import React from 'react';
import { useAuth } from '../features/auth/userauth';
import { authAPI } from '../features/auth/auth.api';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    authAPI.logout();
    logout();
    navigate('/login');
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      // Navigate to mood selection page with both image URL and file object
      navigate('/select-mood', { 
        state: { 
          imageUrl,
          imageFile: file // Pass the actual file object
        } 
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>Welcome to Your Dashboard</h1>
        
        {/* Upload Button */}
        <div className="upload-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button 
            className="upload-button"
            onClick={triggerFileInput}
          >
            Upload Screenshot
          </button>
          

        </div>

        <button 
          onClick={handleLogout} 
          className="logout-button"
        >
          Logout
        </button>
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
