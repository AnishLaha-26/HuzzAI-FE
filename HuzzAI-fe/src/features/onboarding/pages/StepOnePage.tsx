import React, { useState } from 'react';
import { useOnboardingStore } from '../store/onboardingStore';
import './StepOnePage.css';

interface StepOnePageProps {
  onNext: () => void;
  onBack: () => void;
}

export const StepOnePage: React.FC<StepOnePageProps> = ({ onNext, onBack }) => {
  const { formData, updateFormData } = useOnboardingStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Calculate progress percentage based on current step (1 out of 4 steps)
  const progressPercentage = (1 / 4) * 100;

  const validateAndNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    if (!formData.age) {
      newErrors.age = 'Please select your age range';
    }
    if (!formData.goals) {
      newErrors.goals = 'Please select your goal';
    }

    if (!formData.datingFrequency) {
      newErrors.datingFrequency = 'Please select an option';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  const genderOptions = [
    { value: 'M' as const, label: 'Male', emoji: '👨' },
    { value: 'F' as const, label: 'Female', emoji: '👩' },
    { value: 'O' as const, label: 'Other', emoji: '🌈' },
    { value: 'PNTS' as const, label: 'Prefer not to say', emoji: '🤐' }
  ];

  const ageOptions = [
    { value: '<18' as const, label: '<18', emoji: '🌟' },
    { value: '18-24' as const, label: '18-24', emoji: '🚀' },
    { value: '25-34' as const, label: '25-34', emoji: '💪' },
    { value: '35-44' as const, label: '35-44', emoji: '🏆' },
    { value: '45+' as const, label: '45+', emoji: '👑' }
  ];

  const goalOptions = [
    { value: 'LTR' as const, label: 'Long-term', emoji: '💕' },
    { value: 'STD' as const, label: 'Short-term', emoji: '💫' },
    { value: 'CAS' as const, label: 'Casual', emoji: '😎' },
    { value: 'FRD' as const, label: 'Friends', emoji: '🤝' }
  ];

  const datingFrequencyOptions = [
    { value: 'not-even-1', label: 'Not even 1', emoji: '🚫' },
    { value: '1-2', label: '1-2', emoji: '😊' },
    { value: '3-6', label: '3-6', emoji: '🧡' },
    { value: '7-10', label: '7-10', emoji: '🤩' },
    { value: '10+', label: '10+', emoji: '⚡' }
  ];

  return (
    <div className="step-one-page">
      <div className="animated-background" />
      
      <div className="floating-elements">
        <div className="floating-element" style={{ 
          top: '10%', 
          left: '10%', 
          width: '60px', 
          height: '60px',
          animationDelay: '0s'
        }} />
        <div className="floating-element" style={{ 
          top: '20%', 
          right: '15%', 
          width: '80px', 
          height: '80px',
          animationDelay: '2s'
        }} />
        <div className="floating-element" style={{ 
          bottom: '30%', 
          left: '20%', 
          width: '40px', 
          height: '40px',
          animationDelay: '4s'
        }} />
      </div>
      
      <div className="content-container">
        <div className="main-card liquid-glass-dark">
          <div className="header-section">
            <button className="back-button glass-button" onClick={onBack}>
              ← 
            </button>
            <div className="progress-dots">
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
          
          <div className="form-content">
            <div className="title-section">
              <h2 className="main-title">Getting to know you</h2>
              <p className="subtitle">This helps us match your conversation style</p>
            </div>
            
            <div className="form-sections">
              <div className="form-section">
                <h3 className="section-title">Sex</h3>
                <div className="options-grid">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`glass-button option-button ${
                        formData.gender === option.value ? 'selected' : ''
                      }`}
                      onClick={() => updateFormData({ gender: option.value })}
                    >
                      <span className="option-emoji">{option.emoji}</span>
                      <span className="option-label">{option.label}</span>
                    </button>
                  ))}
                </div>
                {errors.gender && <span className="error-text">{errors.gender}</span>}
              </div>
              
              <div className="form-section">
                <h3 className="section-title">Age</h3>
                <div className="options-grid">
                  {ageOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`glass-button option-button ${
                        formData.age === option.value ? 'selected' : ''
                      }`}
                      onClick={() => updateFormData({ age: option.value })}
                    >
                      <span className="option-emoji">{option.emoji}</span>
                      <span className="option-label">{option.label}</span>
                    </button>
                  ))}
                </div>
                {errors.age && <span className="error-text">{errors.age}</span>}
              </div>
              
              <div className="form-section">
                <h3 className="section-title">Dating Intention</h3>
                <div className="options-grid">
                  {goalOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`glass-button option-button ${
                        formData.goals === option.value ? 'selected' : ''
                      }`}
                      onClick={() => updateFormData({ goals: option.value })}
                    >
                      <span className="option-emoji">{option.emoji}</span>
                      <span className="option-label">{option.label}</span>
                    </button>
                  ))}
                </div>
                {errors.goals && <span className="error-text">{errors.goals}</span>}
              </div>
              
              <div className="form-section">
                <h3 className="section-title">Dates in last 6 months?</h3>
                <div className="options-grid">
                  {datingFrequencyOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`glass-button option-button frequency-option ${
                        formData.datingFrequency === option.value ? 'selected' : ''
                      }`}
                      onClick={() => updateFormData({ datingFrequency: option.value })}
                    >
                      <span className="option-emoji">{option.emoji}</span>
                      <span className="option-label">{option.label}</span>
                    </button>
                  ))}
                </div>
                {errors.datingFrequency && <span className="error-text">{errors.datingFrequency}</span>}
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
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};