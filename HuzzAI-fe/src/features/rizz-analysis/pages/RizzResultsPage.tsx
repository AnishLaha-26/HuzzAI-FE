import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { RizzAnalysisData, ConversationTip } from '../types/rizzTypes';
import { parseRizzAnalysisData } from '../utils/dataParser';
import './RizzResultsPage.css';

export const RizzResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState<RizzAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Get analysis data from location state (passed from loading screen)
      const stateData = location.state?.analysisData;
      console.log('🔍 RizzResultsPage: Raw location state:', JSON.stringify(location.state, null, 2));
      console.log('🔍 RizzResultsPage: Extracted stateData:', JSON.stringify(stateData, null, 2));
      
      if (!stateData) {
        console.error('❌ RizzResultsPage: No analysis data found in location state');
        throw new Error('No analysis data found in location state');
      }

      // Parse and validate the data
      console.log('🔄 RizzResultsPage: Calling parseRizzAnalysisData...');
      const parsedData = parseRizzAnalysisData(stateData);
      console.log('✅ RizzResultsPage: Parsed analysis data:', JSON.stringify(parsedData, null, 2));
      
      setAnalysisData(parsedData);
      setIsLoading(false);
      
    } catch (error) {
      console.error('❌ RizzResultsPage: Error processing analysis data:', error);
      setIsLoading(false);
      // Consider redirecting to error page or showing error message
    }
  }, [location.state]);

  const handleBackToDashboard = () => {
    navigate('/loading');
  };

  const handleAnalyzeAnother = () => {
    navigate('/rizz-analysis/upload');
  };

  if (isLoading) {
    return (
      <div className="rizz-results-loading">
        <div className="loading-spinner-large"></div>
        <p>Analyzing your rizz...</p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="rizz-results-error">
        <p>Unable to load analysis results</p>
        <button onClick={handleBackToDashboard}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="rizz-results-page">
      <div className="background-animations">
        <div className="floating-gradient floating-gradient-1"></div>
        <div className="floating-gradient floating-gradient-2"></div>
        <div className="floating-gradient floating-gradient-3"></div>
      </div>

      <div className="results-container">
        <div className="back-button-container">
          <button 
            className="back-button"
            onClick={handleBackToDashboard}
            aria-label="Go back to dashboard"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>

        <div className="results-content">
          <div className="results-card">
            <div className="card-header">
              <div className="logo-container">
                <img src="/huzzlogo.png" alt="HuzzAI Logo" className="logo-image" />
                <span className="logo-text">HuzzAI</span>
              </div>
              <div className="header-divider"></div>
            </div>
            
            <div className="results-title">
              <h2>📊 Rizz Analysis</h2>
            </div>

          {/* Rizz Score */}
          <div className="score-card">
            <div className="score-header">
              <h3>Rizz Score</h3>
              <div className="score-sound">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
                </svg>
              </div>
            </div>
            <div className="score-display">
              <span className="score-number">{analysisData.rizzScore}</span>
              <span className="score-total">/100</span>
            </div>
          </div>

          {/* Engagement & Interest */}
          <div className="metrics-grid">
            <div className="metric-card">
              <h4>Engagement</h4>
              <div className="metric-bars">
                <div className="metric-bar">
                  <span className="metric-label huzz-label">{analysisData.engagement.huzzPercentage}% Them</span>
                </div>
                <div className="metric-bar">
                  <span className="metric-label you-label">{analysisData.engagement.youPercentage}% You</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <h4>Interest Level</h4>
              <div className="metric-circles">
                <div className="circle-metric">
                  <div className="circle-progress" style={{ '--progress': `${analysisData.interestLevel.huzzPercentage}%` } as React.CSSProperties}>
                    <span className="circle-text">{analysisData.interestLevel.huzzPercentage}%</span>
                  </div>
                  <span className="circle-label">Them</span>
                </div>
                <div className="circle-metric">
                  <div className="circle-progress" style={{ '--progress': `${analysisData.interestLevel.youPercentage}%` } as React.CSSProperties}>
                    <span className="circle-text">{analysisData.interestLevel.youPercentage}%</span>
                  </div>
                  <span className="circle-label">You</span>
                </div>
              </div>
            </div>
          </div>

          {/* What you did wrong/well */}
          <div className="feedback-grid">
            <div className="feedback-card wrong">
              <h4>❌ Areas for Improvement</h4>
              <ul className="feedback-list">
                {analysisData.improvements.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="feedback-card well">
              <h4>✅ Your Strengths</h4>
              <ul className="feedback-list">
                {analysisData.strengths.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Conversation Tips */}
          <div className="tip-card">
            <h4>💡 Conversation Tips</h4>
            {analysisData.conversationTips.map((tip: ConversationTip, index: number) => (
              <div key={index} className="tip-item">
                <h5>{tip.tip}</h5>
                <p className="tip-example">{tip.example}</p>
              </div>
            ))}
          </div>

          {/* Suggested Responses */}
          <div className="suggestions-card">
            <h4>💬 Suggested Responses</h4>
            <ul className="suggestions-list">
              {analysisData.suggestedResponses.slice(0, 3).map((response: string, index: number) => (
                <li key={index} className="suggestion-item">{response}</li>
              ))}
            </ul>
          </div>

          {/* Tone & Compatibility */}
          <div className="bottom-metrics">
            <div className="tone-card">
              <h4>Tone Analysis</h4>
              <div className="tone-labels">
                <span className="tone-label huzz-tone">Them: {analysisData.tone.huzz}</span>
                <span className="tone-label you-tone">You: {analysisData.tone.you}</span>
              </div>
              <p className="tone-summary">{analysisData.tone.summary}</p>
            </div>

            <div className="compatibility-card">
              <h4>Compatibility Score</h4>
              <div className="compatibility-circle">
                <div className="compatibility-progress" style={{ '--progress': `${analysisData.compatibilityScore}%` } as React.CSSProperties}>
                  <span className="compatibility-text">{analysisData.compatibilityScore}%</span>
                </div>
              </div>
              <p className="compatibility-summary">{analysisData.compatibilitySummary}</p>
            </div>
          </div>

          {/* Response Time Analysis */}
          <div className="analysis-sections">
            <div className="analysis-card">
              <h4>⏱️ Response Time</h4>
              <p><strong>Your Average:</strong> {analysisData.responseTime.yourAverage}</p>
              <p><strong>Their Average:</strong> {analysisData.responseTime.theirAverage}</p>
              <p className="analysis-suggestion">{analysisData.responseTime.suggestion}</p>
            </div>

            <div className="analysis-card">
              <h4>😀 Emoji Usage</h4>
              <p><strong>Your Usage:</strong> {analysisData.emojiUsage.yourUsage}</p>
              <p><strong>Their Usage:</strong> {analysisData.emojiUsage.theirUsage}</p>
              <p className="analysis-suggestion">{analysisData.emojiUsage.suggestion}</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps-card">
            <h4>🎦 Next Steps</h4>
            <ul className="next-steps-list">
              {analysisData.nextSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="action-buttons">
            <button className="analyze-another-btn" onClick={handleAnalyzeAnother}>
              📊 Analyze Another
            </button>
            <button className="back-dashboard-btn" onClick={handleBackToDashboard}>
              🏠 Back to Dashboard
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};
