export interface ChatHistory {
  timestamp: string;
  prompt: string;
  response: string;
  promptContent: string;
}

export interface UnsplashImage {
  urls: {
    small: string;
  };
}

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  responseFormat: string;
  columns: string[];
  updatedAt: number;
}

export interface MessageBoxOptions {
  type?: 'none' | 'info' | 'error' | 'question' | 'warning';
  title?: string;
  message: string;
  detail?: string;
  buttons?: string[];
  defaultId?: number;
  cancelId?: number;
}

export interface MessageBoxReturnValue {
  response: number;
  checkboxChecked?: boolean;
}

export interface AutomationResult {
  id: number;
  name: string;
  period: string;
  topic: string;
  prompt: string;
  response: string;
  timestamp: string;
}

export interface ExportResult {
  success: boolean;
  error?: string;
}

export interface ElectronAPI {
  // 채팅 관련
  chatGPT: (prompt: string, apiKey: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  loadChatHistory: () => Promise<{ success: boolean; history?: ChatHistory[]; error?: string }>;
  saveChatHistory: (history: ChatHistory[]) => Promise<{ success: boolean; error?: string }>;
  deleteChatHistory: (timestamp: string) => Promise<{ success: boolean; error?: string }>;
  exportChatHistory: (history: ChatHistory[]) => Promise<ExportResult>;
  exportChatHistoryJson: (history: ChatHistory[]) => Promise<ExportResult>;
  fetchUnsplashImages: (query: string) => Promise<{ success: boolean; images: UnsplashImage[] }>;

  // 프롬프트 관련
  savePrompts: (prompts: PromptTemplate[]) => Promise<{ success: boolean; error?: string }>;
  loadPrompts: () => Promise<{ success: boolean; prompts?: PromptTemplate[]; error?: string }>;
  updatePromptTemplate: (template: PromptTemplate) => Promise<{ success: boolean; prompts?: PromptTemplate[]; error?: string }>;

  // API 키 관련
  saveApiKey: (apiKey: string) => Promise<{ success: boolean; error?: string }>;
  loadApiKeys: () => Promise<{ success: boolean; keys: string[]; error?: string }>;
  removeApiKey: (apiKey: string) => Promise<{ success: boolean; error?: string }>;

  // UI 관련
  showMessageBox: (options: MessageBoxOptions) => Promise<MessageBoxReturnValue>;
  showNotification: (title: string, body: string, type: 'success' | 'error' | 'info') => void;
  openExternal: (url: string) => Promise<{ success: boolean; error?: string }>;
}
  
declare global {
  interface Window {
    electronAPI: ElectronAPI;
    electron: {
      openExternal: (url: string) => Promise<void>;
    };
  }
} 