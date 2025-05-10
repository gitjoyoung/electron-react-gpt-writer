import { create } from 'zustand';
import { ChatState } from '../types';

export const useChatStore = create<ChatState>((set) => ({
  // 입력 관련 상태
  input: '',
  isLoading: false,
  response: null,
  
  // 이미지 관련 상태
  images: [],
  isLoadingImages: false,
  
  // 액션
  setInput: (input) => set({ input }),
  setResponse: (response) => set({ response }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setImages: (images) => set({ images }),
  setIsLoadingImages: (isLoadingImages) => set({ isLoadingImages }),
  resetState: () => set({
    input: '',
    response: null,
    images: [],
    isLoading: false,
    isLoadingImages: false
  })
})); 