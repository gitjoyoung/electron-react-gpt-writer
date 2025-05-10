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

export interface ElectronAPI {
  sendChatMessage: (params: {
    apiKey: string;
    message: string;
    promptContent: string;
  }) => Promise<{
    success: boolean;
    response?: string;
    error?: string;
  }>;

  loadChatHistory: () => Promise<{
    success: boolean;
    history?: ChatHistory[];
    error?: string;
  }>;

  saveChatHistory: (history: ChatHistory[]) => Promise<{
    success: boolean;
    error?: string;
  }>;

  deleteChatHistory: (timestamp: string) => Promise<{
    success: boolean;
    error?: string;
  }>;

  fetchUnsplashImages: (query: string) => Promise<{ success: boolean; images: UnsplashImage[] }>;
  getPromptTemplates: () => Promise<PromptTemplate[]>;
  savePromptTemplate: (template: Omit<PromptTemplate, "id">) => Promise<PromptTemplate>;
  deletePromptTemplate: (id: string) => Promise<void>;
  updatePromptTemplate: (template: PromptTemplate) => Promise<{ success: boolean; prompts?: PromptTemplate[]; error?: string }>;
  exportToExcel: (chatHistory: ChatHistory[]) => Promise<{ success: boolean }>;
  showNotification: (title: string, body: string, type: 'success' | 'error' | 'info') => void;
  savePrompts: (prompts: PromptTemplate[]) => Promise<{ success: boolean; error?: string }>;
  loadPrompts: () => Promise<{ success: boolean; prompts?: PromptTemplate[]; error?: string }>;
  saveApiKey: (apiKey: string) => Promise<{ success: boolean; error?: string }>;
  loadApiKeys: () => Promise<{ success: boolean; keys: string[]; error?: string }>;
  removeApiKey: (apiKey: string) => Promise<{ success: boolean; error?: string }>;
  showMessageBox: (options: MessageBoxOptions) => Promise<MessageBoxReturnValue>;
  exportChatHistory: (history: ChatHistory[]) => Promise<{ success: boolean }>;
  chatGPT: (prompt: string, apiKey: string) => Promise<{ success: boolean; message?: string; error?: string }>;
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