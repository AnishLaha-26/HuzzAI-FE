import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepOnePage } from './pages/StepOnePage';
import { StepTwoPage } from './pages/StepTwoPage';
import { StepThreePage } from './pages/StepThreePage';
import { FinalSubmit } from './pages/FinalSubmit';

export const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted!');
    // Here you can add your actual submission logic
    // For now, just log success
    alert('Onboarding completed successfully! 🎉');
  };

  const renderCurrentStep = () => {
    const stepProps = {
      onNext: nextStep,
      onBack: prevStep,
      currentStep,
      totalSteps,
      onSubmit: handleSubmit
    };

    switch (currentStep) {
      case 1:
        return <StepOnePage {...stepProps} />;
      case 2:
        return <StepTwoPage {...stepProps} />;
      case 3:
        return <StepThreePage {...stepProps} />;
      case 4:
        return <FinalSubmit {...stepProps} />;
      default:
        return <StepOnePage {...stepProps} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
      >
        {renderCurrentStep()}
      </motion.div>
    </AnimatePresence>
  );
};
