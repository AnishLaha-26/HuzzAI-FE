import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../features/auth/userauth';
import { authAPI } from '../features/auth/auth.api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const RIZZ_DROPS = [
  "You look like you ghost people and still get missed.",
  "Trouble in your eyes, peace in your vibe. Dangerous combo.",
  "Let's skip small talk. What's your love language?",
  "You're the type of person I'd delete dating apps for.",
  "Your vibe is unmatched, but let's match anyway.",
  "I don't usually believe in love at first sight, but I'm willing to be wrong.",
  "You're not just a snack, you're the whole meal prep.",
  "I'd cross timezones just to hear you laugh."
];

const STEPS = [
  {
    number: 1,
    icon: '📸',
    title: 'Upload Screenshot',
    description: 'Add any chat, bio, or convo you want upgraded.'
  },
  {
    number: 2,
    icon: '🧠',
    title: 'AI Reads the Room',
    description: 'Understands your vibe, goal, and tone.'
  },
  {
    number: 3,
    icon: '💬',
    title: 'Get Flirty Firepower',
    description: 'Returns 3–5 clever message rewrites.'
  }
];

export const Dashboard: React.FC = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentRizzDrop, setCurrentRizzDrop] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('analysis');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-rotate rizz drops every 8 seconds
  useEffect(() => {
    const rizzInterval = setInterval(() => {
      setCurrentRizzDrop(prev => (prev + 1) % RIZZ_DROPS.length);
    }, 5000);

    // Auto-advance carousel every 5 seconds
    const carouselInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % STEPS.length);
    }, 1500);

    return () => {
      clearInterval(rizzInterval);
      clearInterval(carouselInterval);
    };
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    logout();
    navigate('/login');
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      // Navigate to mood selection page with both image URL and file object
      navigate('/select-mood', { 
        state: { 
          imageUrl,
          imageFile: file // Pass the actual file object
        } 
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRizzDropRefresh = () => {
    setCurrentRizzDrop(prev => (prev + 1) % RIZZ_DROPS.length);
  };

  const getGreetingText = () => {
    if (auth?.user?.first_name) {
      return `Hey ${auth.user.first_name}, ready to rizz again?`;
    }
    return "👋 Welcome to the game!";
  };

  return (
    <div className="dashboard-container">
      <div className="window-container">
        <div className="dashboard-content">
          {/* Header Logo + Greeting */}
          <div className="header-section">
            <div className="dashboard-header">
              <div className="branding">
                <img src="/huzzlogo.png" alt="Logo" className="logo-img" />
                <h1 className="brand-title">HuzzAI</h1>
              </div>
              <p className="greeting">{getGreetingText()}</p>
            </div>
          </div>

          {/* Steps Carousel */}
          <div className="steps-section">
            <div className="step-carousel">
              <div className="step-display">
                <div className="step-number">{STEPS[currentStep].number}</div>
                <div className="step-content">
                  <div className="step-header">
                    <div className="step-icon">{STEPS[currentStep].icon}</div>
                    <h3 className="step-title">{STEPS[currentStep].title}</h3>
                  </div>
                  <p className="step-description">{STEPS[currentStep].description}</p>
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* === Section 3: Rizz Drop Window === */}
        <div className="rizz-window">
          <h2 className="section-title">🔥 Today's Rizz Drop</h2>
          <div className="rizz-bubble">
            <p className="rizz-text">
              {RIZZ_DROPS[currentRizzDrop]}
            </p>
          </div>
        </div>


        {/* Main Action Button */}
        <div className="main-action-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            className="main-upload-button"
            onClick={triggerFileInput}
          >
            📸 Upload Screenshot
          </button>

          {/* Tabs */}
          <div className="tabs-container">
            <button
              className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              📊 Analyze my Rizz
            </button>
            <button
              className={`tab ${activeTab === 'fine-tune' ? 'active' : ''}`}
              onClick={() => setActiveTab('fine-tune')}
            >
             ✨ Fine-tune my Rizz
            </button>
          </div>
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="image-preview">
            <img
              src={selectedImage}
              alt="Upload preview"
              className="preview-image"
            />
          </div>
        )}
      </div>

    </div>
  );
};
