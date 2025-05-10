// UI 관련 타입
export interface ChatViewProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  response: string | null;
  onSubmit: () => Promise<void>;
  images: string[];
  isLoadingImages: boolean;
  selectedPromptName?: string;
}

// Store 관련 타입
export interface ChatState {
  // 입력 관련 상태
  input: string;
  isLoading: boolean;
  response: string | null;
  
  // 이미지 관련 상태
  images: string[];
  isLoadingImages: boolean;
  
  // 액션
  setInput: (input: string) => void;
  setResponse: (response: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setImages: (images: string[]) => void;
  setIsLoadingImages: (isLoading: boolean) => void;
  resetState: () => void;
} 