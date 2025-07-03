import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ResponsePage.css';

const ResponsePage = () => {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [spiceLevel, setSpiceLevel] = useState<number>(5);
  const location = useLocation();
  const { imageUrl, mood, imageFile } = location.state as { 
    imageUrl: string; 
    mood: string; 
    imageFile: File 
  } || {};

  useEffect(() => {
    const fetchAIResponse = async () => {
      if (!imageFile) {
        console.error('No image file provided');
        setIsLoading(false);
        return;
      }

      try {
        // Create FormData to send the file
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('mood', mood);
        formData.append('spiceLevel', spiceLevel.toString());

        // TODO: Uncomment and implement the actual API call
        /*
        const response = await fetch('/api/generate-response', {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, let the browser set it with the correct boundary
        });

        if (!response.ok) {
          throw new Error('Failed to generate response');
        }

        const data = await response.json();
        setResponse(data.response);
        */

        // Simulated response for now
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResponse("Here's a " + mood + " response based on your chat screenshot...");
      } catch (error) {
        console.error('Error generating response:', error);
        setResponse("Sorry, we couldn't generate a response. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIResponse();
  }, [imageFile, mood, spiceLevel]);

  const handleRegenerate = () => {
    setIsLoading(true);
    // TODO: Call API to regenerate response
    setTimeout(() => {
      setResponse("Here's another flirty response...");
      setIsLoading(false);
    }, 1500);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      // Optional: Show a toast or notification that text was copied
      alert('Response copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="response-container">
      <h1>Your Response is Ready!</h1>
      
      <div className="screenshot-preview">
        {imageUrl && <img src={imageUrl} alt="Chat screenshot" className="response-screenshot" />}
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
        <label>Spice Level:</label>
        <input
          type="range"
          min="1"
          max="10"
          value={spiceLevel}
          onChange={(e) => setSpiceLevel(parseInt(e.target.value))}
          className="spice-slider"
        />
        <span className="spice-level">{spiceLevel}/10</span>
      </div>

      <div className="action-buttons">
        <button 
          className="regenerate-btn"
          onClick={handleRegenerate}
          disabled={isLoading}
        >
          Rizz Again
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
