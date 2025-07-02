import React, { useState } from 'react';
import { useOnboardingStore } from '../store/onboardingStore';
import './StepThreePage.css';

interface StepThreePageProps {
  onNext: () => void;
  onBack: () => void;
}

export const StepThreePage: React.FC<StepThreePageProps> = ({ onNext, onBack }) => {
  const { formData, updateFormData } = useOnboardingStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.platform) {
      newErrors.platform = 'Please select a platform';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  const platformOptions = [
    { 
      value: 'tinder', 
      label: 'Tinder',
      description: 'Dating app for swiping and matching',
      emoji: '🔥'
    },
    { 
      value: 'bumble', 
      label: 'Bumble',
      description: 'Women make the first move',
      emoji: '🐝'
    },
    { 
      value: 'hinge', 
      label: 'Hinge',
      description: 'Designed to be deleted',
      emoji: '💕'
    },
    { 
      value: 'instagram', 
      label: 'Instagram',
      description: 'Social media platform',
      emoji: '📸'
    },
    { 
      value: 'whatsapp', 
      label: 'WhatsApp',
      description: 'Messaging app',
      emoji: '💬'
    },
    { 
      value: 'telegram', 
      label: 'Telegram',
      description: 'Secure messaging',
      emoji: '📱'
    }
  ];

  return (
    <div className="step-three-page">
      <div className="animated-background" />
      
      <div className="floating-elements">
        <div className="floating-element" style={{ 
          top: '12%', 
          left: '6%', 
          width: '80px', 
          height: '80px',
          animationDelay: '2s'
        }} />
        <div className="floating-element" style={{ 
          top: '30%', 
          right: '10%', 
          width: '60px', 
          height: '60px',
          animationDelay: '4s'
        }} />
        <div className="floating-element" style={{ 
          bottom: '25%', 
          left: '12%', 
          width: '70px', 
          height: '70px',
          animationDelay: '6s'
        }} />
      </div>
      
      <div className="content-container">
        <div className="main-card liquid-glass-dark">
          <div className="header-section">
            <button className="back-button glass-button" onClick={onBack}>
              ← 
            </button>
            <div className="progress-dots">
              <div className="dot completed"></div>
              <div className="dot completed"></div>
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
          
          <div className="form-content">
            <div className="title-section">
              <h2 className="main-title">Platform Selection</h2>
              <p className="subtitle">Choose where you want to use your AI wingman</p>
            </div>
            
            <div className="form-sections">
              <div className="form-section">
                <h3 className="section-title">Select Your Platform</h3>
                <p className="section-description">Pick the platform where you need the most help</p>
                <div className="platform-grid">
                  {platformOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`glass-button platform-button ${
                        formData.platform === option.value ? 'selected' : ''
                      }`}
                      onClick={() => updateFormData({ platform: option.value })}
                    >
                      <div className="platform-emoji">{option.emoji}</div>
                      <div className="platform-content">
                        <div className="platform-label">{option.label}</div>
                        <div className="platform-description">{option.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.platform && <span className="error-text">{errors.platform}</span>}
              </div>
            </div>
          </div>
          
          <div className="footer-section">
            <div className="step-indicator">
              <span>Step 3 of 4</span>
            </div>
            <button className="continue-button" onClick={validateAndNext}>
              Continue →
            </button>
          </div>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ height: '60%' }}></div>
        </div>
      </div>
    </div>
  );
};
