import type { RizzAnalysisData, ConversationTip } from '../types/rizzTypes';

// Default values for missing data
const DEFAULT_VALUES = {
  rizzScore: 0,
  engagement: {
    huzzPercentage: 0,
    youPercentage: 0,
    summary: 'No engagement data available'
  },
  interestLevel: {
    huzzPercentage: 0,
    youPercentage: 0,
    summary: 'No interest level data available'
  },
  tone: {
    you: 'Unknown',
    huzz: 'Unknown',
    summary: 'No tone analysis available'
  },
  compatibilityScore: 0,
  compatibilitySummary: 'No compatibility data available',
  strengths: ['No strengths data available'],
  improvements: ['No improvements data available'],
  conversationTips: [{ tip: 'No tips available', example: 'No examples available' }],
  suggestedResponses: ['No suggested responses available'],
  redFlags: ['No red flags identified'],
  nextSteps: ['No next steps available'],
  openingLineAnalysis: {
    strength: 'No data',
    weakness: 'No data',
    suggestion: 'No suggestions available'
  },
  emojiUsage: {
    yourUsage: 'No data',
    theirUsage: 'No data',
    suggestion: 'No emoji usage data available'
  },
  responseTime: {
    yourAverage: 'No data',
    theirAverage: 'No data',
    suggestion: 'No response time data available'
  },
  conversationFlow: {
    assessment: 'No data',
    suggestion: 'No suggestions available'
  },
  iceBreakerIdeas: ['No ice breaker ideas available'],
  escalationTips: ['No escalation tips available'],
  analysisTimestamp: new Date().toISOString(),
  version: 'unknown'
};

// Type guard to check if a value is a valid number
const isValidNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

// Type guard to check if a value is a valid string
const isValidString = (value: any): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

// Type guard to check if a value is a valid array
const isValidArray = (value: any): value is Array<any> => {
  return Array.isArray(value) && value.length > 0;
};

// Parse conversation tips
const parseConversationTips = (tips: any[]): ConversationTip[] => {
  if (!isValidArray(tips)) return DEFAULT_VALUES.conversationTips;

  return tips.map(tip => ({
    tip: isValidString(tip.tip) ? tip.tip : 'No tip available',
    example: isValidString(tip.example) ? tip.example : 'No example available'
  }));
};

// Parse percentage value
const parsePercentage = (value: any): number => {
  if (!isValidNumber(value)) return 0;
  return Math.min(Math.max(value, 0), 100);
};

// Main parser function
export const parseRizzAnalysisData = (rawData: any): RizzAnalysisData => {
  console.log('🔍 DEBUG: Raw data received:', JSON.stringify(rawData, null, 2));
  
  if (!rawData) {
    console.error('❌ No data provided to parser');
    return DEFAULT_VALUES;
  }

  // Try multiple possible data extraction paths
  let data = rawData;
  
  // Try different possible nested structures
  if (rawData.analysis?.data) {
    data = rawData.analysis.data;
    console.log('✅ Found data in rawData.analysis.data');
  } else if (rawData.data) {
    data = rawData.data;
    console.log('✅ Found data in rawData.data');
  } else if (rawData.analysis) {
    data = rawData.analysis;
    console.log('✅ Found data in rawData.analysis');
  } else {
    console.log('✅ Using rawData directly');
  }
  
  console.log('🔍 DEBUG: Final data object:', JSON.stringify(data, null, 2));
  
  try {
    // Debug individual field extraction
    console.log('🔍 DEBUG: Extracting rizzScore:', data.rizzScore);
    console.log('🔍 DEBUG: Extracting engagement:', data.engagement);
    console.log('🔍 DEBUG: Extracting interestLevel:', data.interestLevel);
    console.log('🔍 DEBUG: Extracting tone:', data.tone);
    console.log('🔍 DEBUG: Extracting compatibilityScore:', data.compatibilityScore);
    console.log('🔍 DEBUG: Extracting strengths:', data.strengths);
    console.log('🔍 DEBUG: Extracting improvements:', data.improvements);
    
    const result = {
      rizzScore: parsePercentage(data.rizzScore || data.rizz_score || data.score),
      
      engagement: {
        huzzPercentage: parsePercentage(data.engagement?.huzzPercentage || data.engagement?.huzz_percentage || data.engagement?.them),
        youPercentage: parsePercentage(data.engagement?.youPercentage || data.engagement?.you_percentage || data.engagement?.you),
        summary: isValidString(data.engagement?.summary) 
          ? data.engagement.summary 
          : DEFAULT_VALUES.engagement.summary
      },

      interestLevel: {
        huzzPercentage: parsePercentage(data.interestLevel?.huzzPercentage || data.interest_level?.huzz_percentage || data.interestLevel?.them),
        youPercentage: parsePercentage(data.interestLevel?.youPercentage || data.interest_level?.you_percentage || data.interestLevel?.you),
        summary: isValidString(data.interestLevel?.summary || data.interest_level?.summary)
          ? (data.interestLevel?.summary || data.interest_level?.summary)
          : DEFAULT_VALUES.interestLevel.summary
      },

      tone: {
        you: isValidString(data.tone?.you) ? data.tone.you : DEFAULT_VALUES.tone.you,
        huzz: isValidString(data.tone?.huzz || data.tone?.them) ? (data.tone?.huzz || data.tone?.them) : DEFAULT_VALUES.tone.huzz,
        summary: isValidString(data.tone?.summary) ? data.tone.summary : DEFAULT_VALUES.tone.summary
      },

      compatibilityScore: parsePercentage(data.compatibilityScore || data.compatibility_score || data.compatibility),
      compatibilitySummary: isValidString(data.compatibilitySummary || data.compatibility_summary) 
        ? (data.compatibilitySummary || data.compatibility_summary) 
        : DEFAULT_VALUES.compatibilitySummary,

      strengths: isValidArray(data.strengths) ? data.strengths : DEFAULT_VALUES.strengths,
      improvements: isValidArray(data.improvements) ? data.improvements : DEFAULT_VALUES.improvements,
      conversationTips: parseConversationTips(data.conversationTips),
      suggestedResponses: isValidArray(data.suggestedResponses) 
        ? data.suggestedResponses 
        : DEFAULT_VALUES.suggestedResponses,

      redFlags: isValidArray(data.redFlags) ? data.redFlags : DEFAULT_VALUES.redFlags,
      nextSteps: isValidArray(data.nextSteps) ? data.nextSteps : DEFAULT_VALUES.nextSteps,

      openingLineAnalysis: {
        strength: isValidString(data.openingLineAnalysis?.strength) 
          ? data.openingLineAnalysis.strength 
          : DEFAULT_VALUES.openingLineAnalysis.strength,
        weakness: isValidString(data.openingLineAnalysis?.weakness)
          ? data.openingLineAnalysis.weakness
          : DEFAULT_VALUES.openingLineAnalysis.weakness,
        suggestion: isValidString(data.openingLineAnalysis?.suggestion)
          ? data.openingLineAnalysis.suggestion
          : DEFAULT_VALUES.openingLineAnalysis.suggestion
      },

      emojiUsage: {
        yourUsage: isValidString(data.emojiUsage?.yourUsage)
          ? data.emojiUsage.yourUsage
          : DEFAULT_VALUES.emojiUsage.yourUsage,
        theirUsage: isValidString(data.emojiUsage?.theirUsage)
          ? data.emojiUsage.theirUsage
          : DEFAULT_VALUES.emojiUsage.theirUsage,
        suggestion: isValidString(data.emojiUsage?.suggestion)
          ? data.emojiUsage.suggestion
          : DEFAULT_VALUES.emojiUsage.suggestion
      },

      responseTime: {
        yourAverage: isValidString(data.responseTime?.yourAverage)
          ? data.responseTime.yourAverage
          : DEFAULT_VALUES.responseTime.yourAverage,
        theirAverage: isValidString(data.responseTime?.theirAverage)
          ? data.responseTime.theirAverage
          : DEFAULT_VALUES.responseTime.theirAverage,
        suggestion: isValidString(data.responseTime?.suggestion)
          ? data.responseTime.suggestion
          : DEFAULT_VALUES.responseTime.suggestion
      },

      conversationFlow: {
        assessment: isValidString(data.conversationFlow?.assessment)
          ? data.conversationFlow.assessment
          : DEFAULT_VALUES.conversationFlow.assessment,
        suggestion: isValidString(data.conversationFlow?.suggestion)
          ? data.conversationFlow.suggestion
          : DEFAULT_VALUES.conversationFlow.suggestion
      },

      iceBreakerIdeas: isValidArray(data.iceBreakerIdeas)
        ? data.iceBreakerIdeas
        : DEFAULT_VALUES.iceBreakerIdeas,
      escalationTips: isValidArray(data.escalationTips)
        ? data.escalationTips
        : DEFAULT_VALUES.escalationTips,

      analysisTimestamp: isValidString(data.analysisTimestamp || data.analysis_timestamp || data.timestamp)
        ? (data.analysisTimestamp || data.analysis_timestamp || data.timestamp)
        : DEFAULT_VALUES.analysisTimestamp,
      version: isValidString(data.version) ? data.version : DEFAULT_VALUES.version
    };
    
    console.log('✅ DEBUG: Final parsed result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error parsing rizz analysis data:', error);
    return DEFAULT_VALUES;
  }
};
