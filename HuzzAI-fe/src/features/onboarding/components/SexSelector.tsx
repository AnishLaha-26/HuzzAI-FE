import React from 'react';
import type { Sex } from '../types/onboarding.types';
import { motion } from 'framer-motion';

const sexOptions = [
  { value: 'male', label: 'Male', icon: '👨' },
  { value: 'female', label: 'Female', icon: '👩' },
  { value: 'non-binary', label: 'Non-binary', icon: '🧑' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: '🤐' },
] as const;

interface SexSelectorProps {
  selectedSex?: Sex | '';
  onSexChange?: (sex: Sex) => void;
}

export const SexSelector: React.FC<SexSelectorProps> = ({ 
  selectedSex = '', 
  onSexChange 
}) => {
  const handleSelect = (sex: Sex) => {
    onSexChange?.(sex);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h3 className="text-white text-2xl font-bold mb-2">Gender</h3>
        <p className="text-white/70 text-base">How do you identify?</p>
      </div>
      
      <div className="space-y-3">
        {sexOptions.map((option, index) => (
          <motion.button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`
              w-full p-4 rounded-2xl border transition-all duration-300
              flex items-center justify-between
              ${selectedSex === option.value
                ? 'bg-white/10 border-white/30 backdrop-blur-sm'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }
            `}
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{option.icon}</span>
              <span className="text-white text-lg font-medium">{option.label}</span>
            </div>
            
            {selectedSex === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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