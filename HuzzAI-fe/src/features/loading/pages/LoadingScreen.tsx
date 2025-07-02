import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const charismaTips = [
  "Maintain eye contact and smile naturally to create instant rapport.",
  "Use open body language to appear more approachable and confident.",
  "Listen actively and respond thoughtfully to show genuine interest.",
  "Find common interests to create meaningful connections.",
  "Use humor appropriately to lighten the mood and show personality.",
  "Be present in the moment and avoid distractions.",
  "Use the person's name in conversation to build connection.",
  "Share personal stories to make conversations more engaging.",
  "Mirror their energy level to create deeper connection.",
  "Ask thoughtful questions to keep conversations flowing.",
  "Use confident body language and stand tall.",
  "Practice active listening and show genuine curiosity.",
];

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Would navigate to home when loading completes
          // setTimeout(() => navigate('/home'), 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 60); // Slightly slower for better UX

    // Rotate through tips
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % charismaTips.length);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="loading-screen">
      <div className="animated-background">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i} 
            className="floating-orb" 
            style={{
              '--delay': `${Math.random() * 8}s`,
              '--size': `${Math.random() * 120 + 40}px`,
              '--left': `${Math.random() * 100}%`,
              '--duration': `${Math.random() * 15 + 10}s`,
              '--opacity': Math.random() * 0.3 + 0.1,
            } as React.CSSProperties} 
          />
        ))}
      </div>
      
      <div className="loading-content">
        <div className="loading-logo">
          <img src="/huzzlogo.png" alt="HuzzAI Logo" className="logo-img" />
          <h1 className="brand-title">HuzzAI</h1>
        </div>
        
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          />
          <div className="progress-text">{progress}%</div>
        </div>
        
        <div className="status-message">
          <span className="breathing-text">We're setting everything up for you</span>
        </div>
        
        <div className="setup-details">
          <div className="setup-item">
            <span className="setup-text">Calibrating your personalized AI wingman...</span>
          </div>
        </div>
        
        <div className="charisma-section">
          <div className="charisma-header">
            <span>Calibrating your replies for...</span>
          </div>
          <div className="charisma-tip">
            <div className="tip-icon">💡</div>
            <p className="tip-text">{charismaTips[currentTip]}</p>
          </div>
        </div>
        
        <div className="loading-message">
          <span className="breathing-dots">.</span>
          <span className="breathing-dots">.</span>
          <span className="breathing-dots">.</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
