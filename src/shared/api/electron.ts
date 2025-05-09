export interface ChatHistory {
  query: string;
  response: string;
  timestamp: string;
  '질문'?: string;
  '답변'?: string;
  '시간'?: string;
  [key: string]: any; // 동적 필드를 위한 인덱스 시그니처
}

export interface UnsplashImage {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
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

export interface ElectronAPI {
  fetchUnsplashImages: (query: string) => Promise<{ success: boolean; images: UnsplashImage[] }>;
  getPromptTemplates: () => Promise<PromptTemplate[]>;
  savePromptTemplate: (template: Omit<PromptTemplate, "id">) => Promise<PromptTemplate>;
  deletePromptTemplate: (id: string) => Promise<void>;
  updatePromptTemplate: (template: PromptTemplate) => Promise<PromptTemplate>;
  exportToExcel: (chatHistory: ChatHistory[]) => Promise<{ success: boolean }>;
  showNotification: (title: string, body: string, type: 'success' | 'error' | 'info') => void;
  savePrompts: (prompts: PromptTemplate[]) => Promise<{ success: boolean; error?: string }>;
  loadPrompts: () => Promise<{ success: boolean; prompts: PromptTemplate[]; error?: string }>;
  saveApiKey: (apiKey: string) => Promise<{ success: boolean; error?: string }>;
  loadApiKeys: () => Promise<{ success: boolean; keys: string[]; error?: string }>;
  removeApiKey: (apiKey: string) => Promise<{ success: boolean; error?: string }>;
  showMessageBox: (options: MessageBoxOptions) => Promise<MessageBoxReturnValue>;
  exportChatHistory: (history: ChatHistory[]) => Promise<{ success: boolean }>;
  chatGPT: (prompt: string, apiKey: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    electron: {
      openExternal: (url: string) => Promise<void>;
    };
  }
} 