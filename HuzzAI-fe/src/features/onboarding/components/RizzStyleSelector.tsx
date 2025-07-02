import React from 'react';
import type { RizzStyle } from '../types/onboarding.types';
import { motion } from 'framer-motion';

const rizzStyleOptions = [
  { 
    value: 'funny', 
    label: 'Funny',
    description: 'Witty and humorous',
    emoji: '😂'
  },
  { 
    value: 'romantic', 
    label: 'Romantic',
    description: 'Sweet and poetic',
    emoji: '💝'
  },
  { 
    value: 'direct', 
    label: 'Direct',
    description: 'Straight to the point',
    emoji: '🎯'
  },
  { 
    value: 'mysterious', 
    label: 'Mysterious',
    description: 'Intriguing and enigmatic',
    emoji: '🔮'
  },
  { 
    value: 'intellectual', 
    label: 'Intellectual',
    description: 'Deep and thoughtful',
    emoji: '🧠'
  },
  { 
    value: 'playful', 
    label: 'Playful',
    description: 'Fun and energetic',
    emoji: '🎉'
  },
] as const;

interface RizzStyleSelectorProps {
  selectedStyles?: RizzStyle[];
  onStylesChange?: (styles: RizzStyle[]) => void;
}

export const RizzStyleSelector: React.FC<RizzStyleSelectorProps> = ({ 
  selectedStyles = [], 
  onStylesChange 
}) => {
  const toggleStyle = (style: RizzStyle) => {
    const newStyles = selectedStyles.includes(style)
      ? selectedStyles.filter(s => s !== style)
      : [...selectedStyles, style];
    onStylesChange?.(newStyles);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-white mb-2">Choose Your Style</h3>
        <p className="text-white/80">Select all that match your personality (max 3)</p>
        <div className="mt-2 text-white/60 text-sm">
          {selectedStyles.length}/3 selected
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {rizzStyleOptions.map((option, index) => (
          <motion.button
            key={option.value}
            onClick={() => toggleStyle(option.value)}
            disabled={!selectedStyles.includes(option.value) && selectedStyles.length >= 3}
            whileHover={{ scale: selectedStyles.length < 3 || selectedStyles.includes(option.value) ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`
              relative p-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-md
              ${selectedStyles.includes(option.value)
                ? 'border-white/60 bg-white/20 shadow-xl'
                : selectedStyles.length >= 3
                ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                : 'border-white/20 bg-white/10 hover:bg-white/15'
              }
            `}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{option.emoji}</div>
              <div className="text-white font-medium mb-1">{option.label}</div>
              <div className="text-white/70 text-xs">{option.description}</div>
              
              {selectedStyles.includes(option.value) && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
      
      {selectedStyles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-white/15 rounded-2xl p-4 border border-white/20"
        >
          <div className="text-center">
            <div className="text-white/90 font-medium mb-2">Selected Styles:</div>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedStyles.map((style) => {
                const option = rizzStyleOptions.find(opt => opt.value === style);
                return (
                  <span key={style} className="inline-flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1 text-sm text-white">
                    <span>{option?.emoji}</span>
                    <span>{option?.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};