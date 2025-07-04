import { useAuth } from '../features/auth/userauth';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResponsePage.css';
import { fileToBase64 } from '../utils/filetoBase64';

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
  const [response, setResponse] = useState<string>('');

  const fetchAIResponse = async () => {
    if (!imageFile || !accessToken) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
  
    try {
      setIsLoading(true);
      setError('');
  
      // Convert image to base64
      const base64Image = await fileToBase64(imageFile);
      
      // Create the request payload
      const payload = {
        mood,
        spiceLevel: spice_level,
        image: base64Image
      };
  
      const res = await fetch('http://localhost:8000/api/analyzer/generate-response/', {
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
      setResponse(data.data.response);
  
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (imageFile) fetchAIResponse();
  }, [imageFile, mood, spice_level]);

  const handleRegenerate = () => {
    setIsLoading(true);
    // Simulate API call to regenerate response
    setTimeout(() => {
      const responses = [
        "I was going to send you a pickup line, but I'm afraid I'd mess it up. So... how about you just tell me your name and we'll pretend I'm smooth? 😅",
        "Do you have a name or can I call you mine? (I'll show myself out after that one... 😬)",
        "I was going to send you a clever message, but then I got nervous and wrote this instead. So... hi! 👋",
        "I was going to send you a message about how beautiful you are, but then I realized that no words could do justice to what I see in your photos.",
        "I was wondering if you'd like to chat? I promise I'm more interesting than my profile makes me seem!"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setResponse(randomResponse);
      setIsLoading(false);
    }, 1000);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      // Optional: Show a toast or notification that text was copied
      alert('Response copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy text to clipboard');
    }
  };

  // Mood selection handler
  const handleMoodChange = (newMood: string) => {
    setMood(newMood);
  };

  return (
    <div className="response-container">
      <h1>Your Response is Ready!</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="screenshot-preview">
        {imageUrl && <img src={imageUrl} alt="Chat screenshot" className="response-screenshot" />}
      </div>

      <div className="mood-selector">
        <p>Select a mood:</p>
        <div className="mood-buttons">
          {['flirty', 'funny', 'sweet', 'mysterious', 'sarcastic', 'romantic'].map((m) => (
            <button
              key={m}
              className={`mood-btn ${mood === m ? 'active' : ''}`}
              onClick={() => handleMoodChange(m)}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="ai-response">
        <h3>AI Suggestion:</h3>
        {isLoading ? (
          <div className="loading-spinner">Generating response...</div>
        ) : (
          <div className="response-text">{response}</div>
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
          className="copy-btn" 
          onClick={handleCopyToClipboard}
          disabled={isLoading || !response}
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

export default ResponsePage;
