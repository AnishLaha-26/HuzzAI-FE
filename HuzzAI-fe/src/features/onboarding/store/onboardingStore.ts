import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { preferencesAPI } from '../../preferences/preferences.api';

export type RizzStyle = 'confident' | 'charming' | 'funny' | 'romantic' | 'mysterious' | 'intellectual';

export interface OnboardingFormData {
  gender?: 'M' | 'F' | 'O' | 'PNTS';
  age?: '<18' | '18-24' | '25-34' | '35-44' | '45+';
  goals?: 'LTR' | 'STD' | 'CAS' | 'FRD';
  relationshipStatus?: string;
  datingFrequency?: string; // UI values: 'not-even-1', '1-2', '3-6', '7-10', '10+'
  rizzStyles?: RizzStyle[];
  platform?: 'tinder' | 'bumble' | 'hinge' | 'instagram' | 'whatsapp' | 'telegram';
}

interface OnboardingStore {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  resetForm: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitPreferences: () => Promise<void>;
  isSubmitting: boolean;
  submissionError: string | null;
}

const initialState: OnboardingFormData = {
  gender: undefined,
  age: undefined,
  goals: undefined,
  relationshipStatus: '',
  datingFrequency: '',
  rizzStyles: [],
  platform: undefined
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      formData: initialState,
      currentStep: 1,
      isSubmitting: false,
      submissionError: null,
      
      updateFormData: (data: Partial<OnboardingFormData>) => 
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),
      
      resetForm: () => 
        set({ formData: initialState, currentStep: 1, submissionError: null }),
      
      setCurrentStep: (step: number) => 
        set({ currentStep: step }),
      
      nextStep: () => 
        set((state) => ({ currentStep: state.currentStep + 1 })),
      
      prevStep: () => 
        set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
      
      submitPreferences: async () => {
        const { formData } = get();
        set({ isSubmitting: true, submissionError: null });
        
        try {
          // Map UI recent dates values to backend expected values
          const mapRecentDates = (value: string | undefined): 'daily' | 'weekly' | 'monthly' | 'rarely' => {
            switch (value) {
              case 'not-even-1': return 'rarely';
              case '1-2': return 'monthly';
              case '3-6': return 'weekly';
              case '7-10':
              case '10+': return 'daily';
              default: return 'weekly';
            }
          };
          
          // Convert form data to API format with backend's expected field names
          // Prepare the data with explicit types to match PreferencesData
          const preferencesData = {
            // User details
            sex: (formData.gender || 'PNTS') as 'M' | 'F' | 'O' | 'PNTS',
            age_group: (formData.age || '18-24') as '<18' | '18-24' | '25-34' | '35-44' | '45+',
            dating_goal: (formData.goals || 'LTR') as 'LTR' | 'STD' | 'CAS' | 'FRD',
            relationship_status: formData.relationshipStatus || 'single',
            
            // Dating preferences
            recent_dates: mapRecentDates(formData.datingFrequency),
            rizz_styles: (formData.rizzStyles?.length ? formData.rizzStyles : ['confident']) as RizzStyle[],
            
            // Platform - map frontend values to backend codes
            chat_platform: (() => {
              const platform = String(formData.platform || 'tinder').replace(/[\"\']/g, '').trim();
              // Map frontend platform values to backend expected codes
              const platformMap: Record<string, string> = {
                'tinder': 'TD',     // Tinder
                'instagram': 'IG',  // Instagram
                'tiktok': 'TI',     // TikTok
                'whatsapp': 'WH',   // WhatsApp
                'telegram': 'TE',   // Telegram
                'bumble': 'OT',     // Other (since Bumble not in backend choices)
                'hinge': 'OT'       // Other (since Hinge not in backend choices)
              };
              return platformMap[platform] || 'TD'; // Default to Tinder
            })() as 'TD' | 'IG' | 'TI' | 'WH' | 'TE' | 'OT',
          };
          
          // Debug logging to see what we're sending
          console.log('Sending preferences data:', JSON.stringify(preferencesData, null, 2));
          console.log('Raw form data platform:', formData.platform);
          console.log('Chat platform value being sent:', preferencesData.chat_platform);
          console.log('Chat platform type:', typeof preferencesData.chat_platform);
          console.log('Chat platform JSON:', JSON.stringify(preferencesData.chat_platform));
          
          try {
            // First try to update existing preferences
            await preferencesAPI.updatePreferences(preferencesData);
          } catch (updateError: any) {
            // If update fails with 404, try to create new preferences
            if (updateError.response?.status === 404) {
              await preferencesAPI.createPreferences(preferencesData);
            } else if (updateError.response?.status === 400 && 
                      updateError.response?.data?.detail?.includes('already exist')) {
              // If we get a 400 with 'already exists' message, try to update
              await preferencesAPI.updatePreferences(preferencesData);
            } else {
              // Re-throw other errors
              throw updateError;
            }
          }
          
          // Clear form data after successful submission
          set({ formData: initialState, isSubmitting: false });
        } catch (error: any) {
          console.error('Failed to submit preferences:', error);
          set({ 
            isSubmitting: false, 
            submissionError: error.response?.data?.message || 'Failed to save preferences. Please try again.'
          });
          throw error;
        }
      },
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
