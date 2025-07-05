export interface ConversationTip {
  tip: string;
  example: string;
}

export interface RizzAnalysisData {
  rizzScore: number;
  engagement: {
    huzzPercentage: number;
    youPercentage: number;
    summary: string;
  };
  interestLevel: {
    huzzPercentage: number;
    youPercentage: number;
    summary: string;
  };
  tone: {
    you: string;
    huzz: string;
    summary: string;
  };
  compatibilityScore: number;
  compatibilitySummary: string;
  strengths: string[];
  improvements: string[];
  conversationTips: ConversationTip[];
  suggestedResponses: string[];
  redFlags: string[];
  nextSteps: string[];
  openingLineAnalysis: {
    strength: string;
    weakness: string;
    suggestion: string;
  };
  emojiUsage: {
    yourUsage: string;
    theirUsage: string;
    suggestion: string;
  };
  responseTime: {
    yourAverage: string;
    theirAverage: string;
    suggestion: string;
  };
  conversationFlow: {
    assessment: string;
    suggestion: string;
  };
  iceBreakerIdeas: string[];
  escalationTips: string[];
  analysisTimestamp: string;
  version: string;
}
