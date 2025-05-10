interface ElectronAPI {
  // API 키 관련
  saveApiKey: (apiKey: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  
  loadApiKeys: () => Promise<{
    success: boolean;
    keys?: string[];
    error?: string;
  }>;
  
  removeApiKey: (apiKey: string) => Promise<{
    success: boolean;
    error?: string;
  }>;

  // 프롬프트 관련
  savePrompts: (prompts: any[]) => Promise<{
    success: boolean;
    error?: string;
  }>;
  
  loadPrompts: () => Promise<{
    success: boolean;
    prompts?: any[];
    error?: string;
  }>;
  
  updatePrompt: (id: string, name: string, content: string, responseFormat: string, columns: string[]) => Promise<{
    success: boolean;
    prompts?: any[];
    error?: string;
  }>;

  // 채팅 관련
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
  
  sendChatMessage: (params: {
    apiKey: string;
    message: string;
    promptContent: string;
  }) => Promise<{
    success: boolean;
    response?: string;
    error?: string;
  }>;

  // UI 관련
  showMessageBox: (options: {
    type: 'none' | 'info' | 'error' | 'question' | 'warning';
    title: string;
    message: string;
  }) => Promise<{
    success: boolean;
    result?: any;
    error?: string;
  }>;

  showNotification: (title: string, body: string, type: 'success' | 'error' | 'info') => Promise<{
    success: boolean;
    error?: string;
  }>;

  showErrorBox: (title: string, content: string) => Promise<{
    success: boolean;
    error?: string;
  }>;

  openExternal: (url: string) => Promise<{
    success: boolean;
    error?: string;
  }>;

  // 이미지 관련
  fetchUnsplashImages: (query: string) => Promise<{
    success: boolean;
    images?: UnsplashImage[];
    error?: string;
  }>;
}

interface ChatHistory {
  timestamp: string;
  prompt: string;
  response: string;
  promptContent: string;
}

interface UnsplashImage {
  urls: {
    small: string;
  };
} 