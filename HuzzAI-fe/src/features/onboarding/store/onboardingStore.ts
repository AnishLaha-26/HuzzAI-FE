import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OnboardingFormData {
  gender?: string;
  age?: string;
  goals?: string;
  relationshipStatus?: string;
  datingFrequency?: string;
  rizzStyles?: string[];
  platform?: string;
}

interface OnboardingStore {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  resetForm: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialState: OnboardingFormData = {
  gender: '',
  age: '',
  goals: '',
  relationshipStatus: '',
  datingFrequency: '',
  rizzStyles: [],
  platform: ''
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      formData: initialState,
      currentStep: 1,
      
      updateFormData: (data: Partial<OnboardingFormData>) => 
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),
      
      resetForm: () => 
        set({ formData: initialState, currentStep: 1 }),
      
      setCurrentStep: (step: number) => 
        set({ currentStep: step }),
      
      nextStep: () => 
        set((state) => ({ currentStep: state.currentStep + 1 })),
      
      prevStep: () => 
        set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        formData: state.formData,
        currentStep: state.currentStep 
      }),
    }
  )
);
