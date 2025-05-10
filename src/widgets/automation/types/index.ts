export interface AutomationHistory {
  timestamp: string;
  topic: string;
  response: string;
  promptContent: string;
}

export interface AutomationState {
  topics: string[];
  isRunning: boolean;
  currentTopic: string | null;
  progress: number;
  history: AutomationHistory[];
} 