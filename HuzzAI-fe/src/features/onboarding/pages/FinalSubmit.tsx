import React, { useState } from 'react';
import { useOnboardingStore } from '../store/onboardingStore';
import { useNavigate } from 'react-router-dom';
import './FinalSubmit.css';

interface FinalSubmitProps {
  onBack: () => void;
}

export const FinalSubmit: React.FC<FinalSubmitProps> = ({ onBack }) => {
  const { formData, submitPreferences, isSubmitting, submissionError } = useOnboardingStore();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLocalError(null);
    try {
      await submitPreferences();
      // Redirect to loading screen after successful onboarding
      navigate('/loading');
    } catch (error) {
      console.error('Failed to submit preferences:', error);
      setLocalError('Failed to save your preferences. Please try again.');
    }
  };

  return (
    <div className="final-submit-page">
      <div className="animated-background" />
      
      <div className="floating-elements">
        <div className="floating-element celebration" style={{ 
          top: '8%', 
          left: '5%', 
          width: '100px', 
          height: '100px',
          animationDelay: '1s'
        }} />
        <div className="floating-element celebration" style={{ 
          top: '20%', 
          right: '8%', 
          width: '80px', 
          height: '80px',
          animationDelay: '3s'
        }} />
        <div className="floating-element celebration" style={{ 
          bottom: '15%', 
          left: '10%', 
          width: '90px', 
          height: '90px',
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
              <div className="dot completed"></div>
              <div className="dot completed"></div>
              <div className="dot completed"></div>
              <div className="dot completed"></div>
              <div className="dot completed"></div>
            </div>
          </div>
          
          <div className="form-content">
            <div className="celebration-section">
              <div className="celebration-icon">
                🎉
              </div>
              <h2 className="main-title">You're All Set!</h2>
              <p className="subtitle">Your AI wingman is ready to help you charm your way to success</p>
            </div>
            
            <div className="summary-section">
              <h3 className="summary-title">Your Profile Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Gender:</span>
                  <span className="summary-value">{formData.gender || 'Not specified'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Age:</span>
                  <span className="summary-value">{formData.age || 'Not specified'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Goal:</span>
                  <span className="summary-value">{formData.goals || 'Not specified'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Rizz Styles:</span>
                  <span className="summary-value">{
                    formData.rizzStyles && formData.rizzStyles.length > 0 
                      ? formData.rizzStyles.join(', ') 
                      : 'Not specified'
                  }</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Platform:</span>
                  <span className="summary-value">{formData.platform || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            <div className="features-preview">
              <h3 className="features-title">What's Next?</h3>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">💬</div>
                  <div className="feature-text">
                    <div className="feature-label">Smart Conversations</div>
                    <div className="feature-description">Get personalized conversation starters</div>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✨</div>
                  <div className="feature-text">
                    <div className="feature-label">AI-Powered Rizz</div>
                    <div className="feature-description">Tailored responses for your style</div>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <div className="feature-text">
                    <div className="feature-label">Better Matches</div>
                    <div className="feature-description">Increase your success rate</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="completion-badge">
              <span>Setup Complete! 🎉</span>
            </div>
          </div>
          
          <div className="footer-section">
            {(submissionError || localError) && (
              <div className="error-message" style={{ 
                color: '#ff6b6b', 
                background: 'rgba(255, 107, 107, 0.1)', 
                padding: '10px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {submissionError || localError}
              </div>
            )}
            <button 
              className={`continue-button launch-button ${isSubmitting ? 'loading' : ''}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Launch HuzzAI 🚀'}
            </button>
          </div>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill completed" style={{ height: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};
