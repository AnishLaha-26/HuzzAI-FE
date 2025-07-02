import React, { useState } from 'react';
import { useOnboardingStore, type RizzStyle } from '../store/onboardingStore';
import './StepTwoPage.css';

interface StepTwoPageProps {
  onNext: () => void;
  onBack: () => void;
}

export const StepTwoPage: React.FC<StepTwoPageProps> = ({ onNext, onBack }) => {
  const { formData, updateFormData } = useOnboardingStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.rizzStyles || formData.rizzStyles.length === 0) {
      newErrors.rizzStyles = 'Please select at least one Rizz style';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  const rizzStyleOptions: Array<{ value: RizzStyle; label: string; description: string; emoji: string }> = [
    { 
      value: 'confident', 
      label: 'Confident & Direct',
      description: 'Bold and straightforward approach',
      emoji: '💪'
    },
    { 
      value: 'charming', 
      label: 'Charming & Smooth',
      description: 'Suave and sophisticated style',
      emoji: '😎'
    },
    { 
      value: 'funny', 
      label: 'Funny & Witty',
      description: 'Humor-based conversation',
      emoji: '😂'
    },
    { 
      value: 'romantic', 
      label: 'Romantic & Sweet',
      description: 'Heartfelt and tender approach',
      emoji: '💕'
    },
    { 
      value: 'mysterious', 
      label: 'Mysterious & Intriguing',
      description: 'Keep them guessing',
      emoji: '🔮'
    },
    { 
      value: 'intellectual', 
      label: 'Intellectual & Deep',
      description: 'Thoughtful conversations',
      emoji: '🧠'
    }
  ];

  const toggleRizzStyle = (style: RizzStyle) => {
    const currentStyles = formData.rizzStyles || [];
    const newStyles: RizzStyle[] = [...currentStyles];
    
    const styleIndex = newStyles.indexOf(style);
    if (styleIndex > -1) {
      newStyles.splice(styleIndex, 1);
    } else {
      newStyles.push(style);
    }
    
    updateFormData({ rizzStyles: newStyles });
  };

  return (
    <div className="step-two-page">
      <div className="animated-background" />
      
      <div className="floating-elements">
        <div className="floating-element" style={{ 
          top: '15%', 
          left: '8%', 
          width: '70px', 
          height: '70px',
          animationDelay: '1s'
        }} />
        <div className="floating-element" style={{ 
          top: '25%', 
          right: '12%', 
          width: '50px', 
          height: '50px',
          animationDelay: '3s'
        }} />
        <div className="floating-element" style={{ 
          bottom: '20%', 
          left: '15%', 
          width: '60px', 
          height: '60px',
          animationDelay: '5s'
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
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
          
          <div className="form-content">
            <div className="title-section">
              <h2 className="main-title">Calibrating AI</h2>
              <p className="subtitle">Choose your conversation styles to personalize your Rizz</p>
            </div>
            
            <div className="form-sections">
              <div className="form-section">
                <h3 className="section-title">Select Your Rizz Styles</h3>
                <p className="section-description">Choose multiple styles that match your personality</p>
                <div className="rizz-styles-grid">
                  {rizzStyleOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`glass-button rizz-style-button ${
                        formData.rizzStyles?.includes(option.value) ? 'selected' : ''
                      }`}
                      onClick={() => toggleRizzStyle(option.value)}
                    >
                      <div className="rizz-style-emoji">{option.emoji}</div>
                      <div className="rizz-style-content">
                        <div className="rizz-style-label">{option.label}</div>
                        <div className="rizz-style-description">{option.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.rizzStyles && <span className="error-text">{errors.rizzStyles}</span>}
              </div>
            </div>
          </div>
          
          <div className="footer-section">
            
            <button className="continue-button" onClick={validateAndNext}>
              Continue →
            </button>
          </div>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ height: '40%' }}></div>
        </div>
      </div>
    </div>
  );
};