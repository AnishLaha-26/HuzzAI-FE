import React from 'react';
import type { AgeGroup } from '../types/onboarding.types';
import { motion } from 'framer-motion';

const ageOptions = [
  { value: '18-24', label: '18-24', description: 'Early twenties' },
  { value: '25-34', label: '25-34', description: 'Young professional' },
  { value: '35-44', label: '35-44', description: 'Established adult' },
  { value: '45-54', label: '45-54', description: 'Mid-life' },
  { value: '55+', label: '55+', description: 'Mature adult' },
] as const;

interface AgeGroupSelectorProps {
  selectedAge?: AgeGroup | '';
  onAgeChange?: (age: AgeGroup) => void;
}

export const AgeGroupSelector: React.FC<AgeGroupSelectorProps> = ({ 
  selectedAge = '', 
  onAgeChange 
}) => {
  const handleSelect = (age: AgeGroup) => {
    onAgeChange?.(age);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h3 className="text-white text-2xl font-bold mb-2">Age Range</h3>
        <p className="text-white/70 text-base">Select your age group</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {ageOptions.map((option, index) => (
          <motion.button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`
              p-4 rounded-2xl border transition-all duration-300
              text-center relative
              ${selectedAge === option.value
                ? 'bg-white/10 border-white/30 backdrop-blur-sm'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }
            `}
          >
            <div className="text-white text-xl font-bold mb-1">{option.label}</div>
            <div className="text-white/60 text-sm">{option.description}</div>
            
            {selectedAge === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};