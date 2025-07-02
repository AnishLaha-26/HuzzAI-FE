import React, { useState } from 'react';
import  { useOnboardingStore } from '../store/onboardingStore';
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
    if (!formData.relationshipStatus) {
      newErrors.relationshipStatus = 'Please answer this question';
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
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-Binary' }
  ];

  const ageOptions = [
    { value: 'under-18', label: 'Under 18' },
    { value: '18-24', label: '18-24' },
    { value: '25-34', label: '25-34' },
    { value: '35-44', label: '35-44' },
    { value: '45+', label: '45+' }
  ];

  const goalOptions = [
    { value: 'relationship', label: 'Relationship' },
    { value: 'casual', label: 'Casual' },
    { value: 'fun', label: 'Fun' }
  ];

  const datingFrequencyOptions = [
    { value: 'not-even-1', label: 'Not even 1' },
    { value: '1-2', label: '1-2' },
    { value: '3-6', label: '3-6' },
    { value: '7-10', label: '7-10' },
    { value: '10+', label: '10+' }
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
                      {option.label}
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
                      {option.label}
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
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.goals && <span className="error-text">{errors.goals}</span>}
              </div>
              
              <div className="form-section">
                <h3 className="section-title">I'm in a relationship</h3>
                <div className="options-grid single-option">
                  <button
                    className={`glass-button option-button ${
                      formData.relationshipStatus === 'in-relationship' ? 'selected' : ''
                    }`}
                    onClick={() => updateFormData({ relationshipStatus: formData.relationshipStatus === 'in-relationship' ? '' : 'in-relationship' })}
                  >
                    I'm in a relationship
                  </button>
                </div>
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
                      {option.value === 'not-even-1' && '🚫'}
                      {option.value === '1-2' && '😊'}
                      {option.value === '3-6' && '🧡'}
                      {option.value === '7-10' && '🤩'}
                      {option.value === '10+' && '⚡'}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
                {errors.datingFrequency && <span className="error-text">{errors.datingFrequency}</span>}
              </div>
            </div>
          </div>
          
          <div className="footer-section">
            <div className="step-indicator">
              <span>1/4</span>
            </div>
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