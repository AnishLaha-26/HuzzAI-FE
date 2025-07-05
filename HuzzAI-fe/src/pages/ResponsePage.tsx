import { useAuth } from '../features/auth/userauth';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResponsePage.css';
import { imageToBase64 } from '../utils/imageUtils';
import { API_BASE_URL } from '../config/api';

const ResponsePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [spice_level, setSpiceLevel] = useState<number>(5);
  const [mood, setMood] = useState<string>('flirty');
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuth();               // ① grab token from context
  const accessToken = auth?.accessToken;  
  
  // Get initial values from location state
  const { 
    imageUrl = '',
    imageFile: initialImageFile = null 
  } = (location.state as { 
    imageUrl?: string; 
    imageFile?: File | null;
  }) || {};

  const [imageFile] = useState<File | null>(initialImageFile);
  interface AIResponse {
    success: boolean;
    reply: string;
    mood: string;
    spice_level: number;
    prompt_used?: string;
  }

  const [response, setResponse] = useState<AIResponse | null>(null);
  const [aiReply, setAiReply] = useState<string>('');

  const fetchAIResponse = async () => {
    if (!imageFile || !accessToken) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
  
    try {
      setIsLoading(true);
      setError('');
  
      // Convert image to base64
      const base64Image = await imageToBase64(imageFile);
      
      // Create the request payload
      const payload = {
        mood,
        spice_level: parseInt(spice_level.toString()), // Ensure it's an integer
        image: base64Image
      };
  
      // Make sure this matches your Django URL pattern exactly
      const res = await fetch(`${API_BASE_URL}/context-reply/analyze-image/`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) {
        throw new Error('Failed to get response from AI');
      }
  
      const data = await res.json();
      if (data.success && data.reply) {
        setResponse(data);
        setAiReply(data.reply);
      } else {
        throw new Error(data.message || 'Failed to generate response');
      }
  
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (imageFile) fetchAIResponse();
  }, [imageFile, mood, spice_level]);

  const handleRegenerate = async () => {
    if (!imageFile || !accessToken) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      setIsLoading(true);
      setError('');
  
      // Convert image to base64
      const base64Image = await imageToBase64(imageFile);
      
      // Create the request payload with current settings
      const payload = {
        mood,
        spice_level: parseInt(spice_level.toString()),
        image: base64Image
      };
  
      // Make the API request
      const res = await fetch(`${API_BASE_URL}/context-reply/analyze-image/`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) {
        throw new Error('Failed to regenerate response from AI');
      }
  
      const data = await res.json();
      if (data.success && data.reply) {
        setResponse(data);
        setAiReply(data.reply);
      } else {
        throw new Error(data.message || 'Failed to generate new response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Mood selection handler
  const handleMoodChange = (newMood: string) => {
    setMood(newMood);
  };

  return (
    <div className="response-container">
      <div className="header-section">
        <div className="logo-container">
          <img src="/huzzlogo.png" alt="HuzzAI Logo" className="logo-image" />
          <h1 className="logo-text">HuzzAI</h1>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      
      <div className="screenshot-preview">
        {imageUrl && <img src={imageUrl} alt="Chat screenshot" className="response-screenshot" />}
      </div>

      <div className="mood-selector">
        <h3>Select Mood:</h3>
        <div className="mood-buttons">
          {[
            { value: 'flirty', emoji: '😉' },
            { value: 'funny', emoji: '😂' },
            { value: 'sweet', emoji: '🥰' },
            { value: 'mysterious', emoji: '🕵️‍♂️' },
            { value: 'sarcastic', emoji: '😏' },
            { value: 'romantic', emoji: '💘' }
          ].map(({ value, emoji }) => (
            <button
              key={value}
              className={`mood-btn ${mood === value ? 'active' : ''}`}
              onClick={() => handleMoodChange(value)}
            >
              <span className="mood-emoji">{emoji}</span>
              <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ai-response">
        <h3>AI Suggestion</h3>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-text">Crafting your perfect response...</div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <div className="loading-subtext">This usually takes 5-10 seconds</div>
            </div>
          </div>
        ) : response ? (
          <div className="response-details">
            <div className="response-meta">
              <span className="response-mood">
                Mood: <strong>{response.mood.charAt(0).toUpperCase() + response.mood.slice(1)}</strong>
              </span>
              <span className="response-spice">
                Spice Level: <strong>{response.spice_level}/10</strong>
              </span>
            </div>
            <div className="response-text">
              {aiReply.split('\n').map((line, i) => (
                <p key={i} style={{ margin: i > 0 ? '1rem 0 0' : '0' }}>{line}</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-response">
            No response generated yet. Adjust your settings and try again.
          </div>
        )}
      </div>

      <div className="spice-control">
        <label>Spice Level: {spice_level}/10</label>
        <input
          type="range"
          min="1"
          max="10"
          value={spice_level}
          onChange={(e) => setSpiceLevel(parseInt(e.target.value))}
          className="spice-slider"
        />
      </div>

      <div className="action-buttons">
        <button 
          className="regenerate-btn"
          onClick={handleRegenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Rizz Again'}
        </button>
        <button 
          className="back-to-dashboard"
          onClick={handleBackToDashboard}
          disabled={isLoading}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResponsePage;
