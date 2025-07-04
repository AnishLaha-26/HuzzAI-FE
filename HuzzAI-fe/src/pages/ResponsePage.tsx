import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResponsePage.css';

const ResponsePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [spiceLevel, setSpiceLevel] = useState<number>(5);
  const [mood, setMood] = useState<string>('flirty');
  const location = useLocation();
  const navigate = useNavigate();
  
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
    if (!imageFile) {
      setError('Please upload an image first');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setResponse('');

      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('mood', mood);
      formData.append('spiceLevel', spiceLevel.toString());

      // Get the auth token from localStorage
      const userToken = localStorage.getItem('authToken');
      
      if (!userToken) {
        // Redirect to login if not authenticated
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      // Replace with your actual backend URL
      const response = await fetch('http://your-backend-url/api/analyzer/generate-response/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        body: formData
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to generate response');
      }

      if (responseData.status === 'success') {
        setResponse(responseData.data?.response || 'No response generated');
      } else {
        throw new Error(responseData.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error generating AI response:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setResponse("Sorry, we couldn't generate a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchAIResponse when component mounts with an image file
  useEffect(() => {
    if (initialImageFile) {
      fetchAIResponse();
    }
  }, [initialImageFile]);

  // Mock response generation for demo purposes
  useEffect(() => {
    if (!initialImageFile) return;
    
    const generateMockResponse = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responses = {
        flirty: "Hey there! I couldn't help but notice your smile in your profile picture. It's making me forget my pickup line... guess you have that effect on people 😉",
        funny: "Are you a magician? Because whenever I look at your profile, everyone else disappears! (Too cheesy? I'll show myself out... 🚪🏃‍♂️)",
        sweet: "I just wanted to say your profile really stood out to me. There's a warmth in your eyes that made me want to reach out and say hello! 🌟",
        mysterious: "I'd tell you a joke about time travel, but you didn't like it... yet. 😏",
        sarcastic: "Oh great, another match. I was just running low on people to ignore my terrible jokes. Let's be terrible together? 🙃",
        romantic: "I was going to send you a message about how beautiful you are, but then I realized that no words could do justice to what I see in your photos. So I'll just say this: your smile made me stop scrolling. 🌹"
      };
      
      setResponse(responses[mood as keyof typeof responses] || responses.flirty);
      setIsLoading(false);
    };

    generateMockResponse();
  }, [mood, spiceLevel, initialImageFile]);

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
        <label>Spice Level: {spiceLevel}/10</label>
        <input
          type="range"
          min="1"
          max="10"
          value={spiceLevel}
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
