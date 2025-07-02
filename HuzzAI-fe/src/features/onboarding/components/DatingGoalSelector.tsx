import React from 'react';
import type { DatingGoal } from '../types/onboarding.types';
import { motion } from 'framer-motion';

const goalOptions = [
  { value: 'long-term', label: 'Long-term relationship', description: 'Looking for something serious' },
  { value: 'short-term', label: 'Short-term dating', description: 'Casual dating and fun' },
  { value: 'casual', label: 'Casual hangouts', description: 'Just meeting people' },
  { value: 'friends', label: 'New friends', description: 'Expanding social circle' },
  { value: 'not-sure', label: 'Not sure yet', description: 'Open to possibilities' },
] as const;

interface DatingGoalSelectorProps {
  selectedGoal?: DatingGoal | '';
  onGoalChange?: (goal: DatingGoal) => void;
}

export const DatingGoalSelector: React.FC<DatingGoalSelectorProps> = ({ 
  selectedGoal = '', 
  onGoalChange 
}) => {
  const handleSelect = (goal: DatingGoal) => {
    onGoalChange?.(goal);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-light text-white/90 mb-2">Dating Goals</h3>
        <p className="text-white/60 text-sm font-light">What are you looking for?</p>
      </div>
      
      <div className="space-y-3">
        {goalOptions.map((option, index) => (
          <motion.button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className={`
              w-full p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md text-left
              ${selectedGoal === option.value
                ? 'border-white/40 bg-white/20 shadow-lg'
                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-light mb-1">{option.label}</div>
                <div className="text-white/60 text-sm">{option.description}</div>
              </div>
              
              {selectedGoal === option.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 bg-white/90 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};