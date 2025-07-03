import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './SelectMoodPage.css';

type MoodOption = {
  value: string;
  label: string;
  description?: string; // Made optional with '?'
  emoji: string;
};

export const SelectMoodPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageUrl, imageFile } = location.state as { 
    imageUrl: string; 
    imageFile: File;
  };

  const moodOptions: MoodOption[] = [
    { value: 'flirty', label: 'Flirty', emoji: '😉' },
    { value: 'funny', label: 'Funny', emoji: '😂' },
    { value: 'sweet', label: 'Sweet', emoji: '🥰' },
    { value: 'mysterious', label: 'Mysterious', emoji: '🕵️‍♂️' },
    { value: 'sarcastic', label: 'Sarcastic', emoji: '😏' },
    { value: 'romantic', label: 'Romantic', emoji: '💘' },
  ];

  const handleMoodSelect = (mood: string) => {
    navigate('/response', { 
      state: { 
        mood,
        imageUrl,
        imageFile // Pass the file object to the response page
      } 
    });
  };

  return (
    <div className="mood-selection-container">
      <div className="mood-selection-content">
        <h1>Choose Your Vibe</h1>
        
        <div className="preview-section">
          <div className="image-preview">
            <img 
              src={imageUrl} 
              alt="Chat screenshot" 
              className="screenshot"
            />
          </div>
        </div>
        
        <div className="mood-grid">
          {moodOptions.map((mood) => (
            <motion.div
              key={mood.value}
              className="mood-option"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMoodSelect(mood.value)}
            >
              <div className="mood-emoji">{mood.emoji}</div>
              <div className="mood-label">{mood.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectMoodPage;
