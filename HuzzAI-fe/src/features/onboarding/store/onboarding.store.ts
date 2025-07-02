import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type{ 
  OnboardingFormData, 
  Sex, 
  AgeGroup, 
  DatingGoal, 
  RizzStyle, 
  ChatPlatform 
} from '../types/onboarding.types';

interface OnboardingStore {
  // Form Data
  formData: OnboardingFormData;
  
  // Actions
  setSex: (sex: Sex | '') => void;
  setAgeGroup: (ageGroup: AgeGroup | '') => void;
  setDatingGoal: (datingGoal: DatingGoal | '') => void;
  setRizzStyles: (rizzStyles: RizzStyle[]) => void;
  setChatPlatform: (platform: ChatPlatform | '') => void;
  
  // Progress tracking
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  
  // Reset form
  resetForm: () => void;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const initialState: Omit<OnboardingStore, 
  | 'setSex' 
  | 'setAgeGroup' 
  | 'setDatingGoal' 
  | 'setRizzStyles' 
  | 'setChatPlatform' 
  | 'nextStep' 
  | 'prevStep' 
  | 'goToStep' 
  | 'resetForm' 
  | 'setError'
> = {
  formData: {
    sex: '',
    ageGroup: '',
    datingGoal: '',
    rizzStyles: [],
    chatPlatform: '',
  },
  currentStep: 1,
  isLoading: false,
  error: null,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setSex: (sex) => 
        set((state) => ({
          formData: { ...state.formData, sex },
        })),
        
      setAgeGroup: (ageGroup) =>
        set((state) => ({
          formData: { ...state.formData, ageGroup },
        })),
        
      setDatingGoal: (datingGoal) =>
        set((state) => ({
          formData: { ...state.formData, datingGoal },
        })),
        
      setRizzStyles: (rizzStyles) =>
        set((state) => ({
          formData: { ...state.formData, rizzStyles },
        })),
        
      setChatPlatform: (chatPlatform) =>
        set((state) => ({
          formData: { ...state.formData, chatPlatform },
        })),
      
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 5), // Assuming 5 steps total
        })),
        
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),
        
      goToStep: (step) =>
        set({
          currentStep: Math.max(1, Math.min(step, 5)), // Clamp between 1 and 5
        }),
        
      resetForm: () =>
        set({
          formData: { ...initialState.formData },
          currentStep: 1,
          error: null,
        }),
        
      setError: (error) =>
        set({
          error,
        }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
      }),
    }
  )
);

// Export a hook to use the onboarding store with a selector
export const useOnboardingForm = () => {
  return useOnboardingStore((state) => ({
    formData: state.formData,
    currentStep: state.currentStep,
    isLoading: state.isLoading,
    error: state.error,
    setSex: state.setSex,
    setAgeGroup: state.setAgeGroup,
    setDatingGoal: state.setDatingGoal,
    setRizzStyles: state.setRizzStyles,
    setChatPlatform: state.setChatPlatform,
    nextStep: state.nextStep,
    prevStep: state.prevStep,
    goToStep: state.goToStep,
    resetForm: state.resetForm,
    setError: state.setError,
  }));
};
