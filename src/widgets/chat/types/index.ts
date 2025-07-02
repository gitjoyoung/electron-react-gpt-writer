// UI 관련 타입
export interface ChatViewProps {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  response: string | null;
  messages: ChatMessage[];
  onSubmit: () => void;
  saveToResults: () => void;
  startNewChat: () => void;
  selectedPromptName?: string;
}

// 메시지 타입
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
} 