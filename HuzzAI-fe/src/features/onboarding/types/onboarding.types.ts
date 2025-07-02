// Define the possible values for each preference
export type Sex = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export type AgeGroup = '18-24' | '25-34' | '35-44' | '45-54' | '55+';

export type DatingGoal = 'long-term' | 'short-term' | 'casual' | 'not-sure' | 'friends';

export type RizzStyle = 'funny' | 'romantic' | 'direct' | 'mysterious' | 'intellectual' | 'playful';

export type ChatPlatform = 'whatsapp' | 'instagram' | 'telegram' | 'signal' | 'other';

export interface Preferences {
  id?: string;
  userId: string;
  sex: Sex;
  ageGroup: AgeGroup;
  datingGoal: DatingGoal;
  recentDates: string[]; // Array of date IDs or references
  rizzStyles: RizzStyle[];
  chatPlatform: ChatPlatform;
  createdAt?: Date;
  updatedAt?: Date;
}

// For form state management
export interface OnboardingFormData {
  sex: Sex | '';
  ageGroup: AgeGroup | '';
  datingGoal: DatingGoal | '';
  rizzStyles: RizzStyle[];
  chatPlatform: ChatPlatform | '';
}

// For API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}