import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageToBase64 } from '../../../utils/imageUtils';
import { rizzAnalysisApi } from '../api/rizzAnalysis.api';
import './RizzUploadPage.css';

export const RizzUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setSelectedFile(file);
        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        
        // Convert to base64 for backend
        const base64 = await imageToBase64(file);
        setBase64Image(extractBase64Data(base64)); // Store just the base64 data part
      } catch (error) {
        console.error('Error processing image:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !base64Image) return;
    
    setIsUploading(true);
    
    try {
      // Send the image to the backend for analysis
      const result = await rizzAnalysisApi.analyzeImage(base64Image);
      
      if (result.success) {
        console.log('Analysis results:', result.data);
        // Navigate to loading screen, which will then go to results
        navigate('/rizz-analysis/loading', { 
          state: { analysisData: result.data } 
        });
      } else {
        // Handle API error
        console.error('Analysis failed:', result.message);
        // You might want to show an error message to the user here
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      // Show error message to user
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="rizz-upload-page">
      <div className="background-animations">
        <div className="floating-gradient floating-gradient-1"></div>
        <div className="floating-gradient floating-gradient-2"></div>
        <div className="floating-gradient floating-gradient-3"></div>
      </div>

      <div className="upload-container">
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

        <div className="upload-content">
          <div className="upload-card">
            <div className="card-header">
              <div className="logo-container">
                <img src="/huzzlogo.png" alt="HuzzAI Logo" className="logo-image" />
                <span className="logo-text">HuzzAI</span>
              </div>
              <div className="header-divider"></div>
            </div>
            <div className="upload-title">
              <h2>📊 Rizz Analysis</h2>
              <p>Upload your conversation screenshot and let AI analyze your game</p>
            </div>

            <div className="upload-section">
              {!previewUrl ? (
                <div className="upload-area">
                  <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-input" className="upload-zone">
                    <div className="upload-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                    <div className="upload-text">
                      <h3>Upload Screenshot</h3>
                      <p>Tap to select from your camera roll</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="preview-section">
                  <div className="image-preview">
                    <img src={previewUrl} alt="Preview" />
                  </div>
                  <button 
                    className="change-image-btn"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setBase64Image(null);
                    }}
                  >
                    Change Image
                  </button>
                </div>
              )}
            </div>

            <div className="guidance-section">
              <h3>📸 What makes a good screenshot?</h3>
              <ul className="guidance-list">
                <li>Clear, readable text messages</li>
                <li>Shows the full conversation context</li>
                <li>Include both your messages and their responses</li>
                <li>Avoid blurry or cut-off screenshots</li>
              </ul>
            </div>

            {selectedFile && (
              <div className="upload-actions">
                <button 
                  className={`upload-button ${!selectedFile ? 'disabled' : ''} ${isUploading ? 'loading' : ''}`}
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      🧠 Analyze My Rizz
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function extractBase64Data(base64: string) {
  // Assuming base64 is in the format "data:image/jpeg;base64,..."
  const commaIndex = base64.indexOf(',');
  if (commaIndex === -1) {
    throw new Error('Invalid base64 format');
  }
  return base64.substring(commaIndex + 1);
}
