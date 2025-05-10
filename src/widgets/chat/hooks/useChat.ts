import { useCallback, useEffect } from 'react';
import { useStore } from '../../../shared/store/useStore';
import { useChatStore } from '../store/useChatStore';
import type { ChatHistory } from '../../../shared/api/electron';

export const useChat = () => {
  const { apiKey, selectedPrompt } = useStore();
  const {
    input,
    setInput,
    isLoading,
    setIsLoading,
    response,
    setResponse,
    images,
    setImages,
    isLoadingImages,
    setIsLoadingImages,
    resetState
  } = useChatStore();

  // 초기 채팅 내역 로드
  useEffect(() => {
    const loadInitialHistory = async () => {
      try {
        const result = await window.electronAPI.loadChatHistory();
        if (result.success && result.history && result.history.length > 0) {
          // 가장 최근 대화 내역을 표시
          const lastHistory = result.history[result.history.length - 1];
          setResponse(lastHistory.response);
        }
      } catch (error) {
        console.error("채팅 내역 로드 실패:", error);
      }
    };

    loadInitialHistory();
  }, [setResponse]);

  // 이미지 검색
  useEffect(() => {
    const fetchImages = async () => {
      if (!response) return;

      const searchTerm = response.split("\n")[0].slice(0, 50);

      setIsLoadingImages(true);
      try {
        const result = await window.electronAPI.fetchUnsplashImages(searchTerm);
        if (result.success) {
          setImages(result.images.map(image => image.urls.small));
        }
      } catch (error) {
        console.error("이미지 검색 실패:", error);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, [response, setImages, setIsLoadingImages]);

  // 채팅 제출 처리
  const handleSubmit = useCallback(async (input: string) => {
    if (!apiKey) {
      await window.electronAPI.showMessageBox({
        type: "warning",
        title: "API 키 필요",
        message: "OpenAI API 키를 입력해주세요.",
      });
      return null;
    }

    try {
      // 프롬프트가 있는 경우 사용자 입력을 먼저 배치하고 프롬프트 내용을 추가
      let message = selectedPrompt 
        ? `${input}\n\n${selectedPrompt.content}`
        : input;

      // 프롬프트가 있고 반환 형식이 지정된 경우
      if (selectedPrompt?.responseFormat) {
        message += `\n\n반환 형식: ${selectedPrompt.responseFormat}`;
      }

      // 프롬프트가 있고 속성이 지정된 경우
      if (selectedPrompt?.columns && selectedPrompt.columns.length > 0) {
        message += `\n\n다음 속성을 반드시 포함해주세요: ${selectedPrompt.columns.join(', ')}`;
      }

      console.log("전송할 메시지:", message);
      const result = await window.electronAPI.chatGPT(message, apiKey);

      if (result.success && result.message) {
        // 현재 저장된 대화 내역 로드
        const historyResult = await window.electronAPI.loadChatHistory();
        const currentHistory = historyResult.success ? historyResult.history || [] : [];

        // 새로운 대화 내역 생성
        const newHistory: ChatHistory = {
          timestamp: Date.now().toString(),
          prompt: input,
          response: result.message,
          promptContent: selectedPrompt?.content || input
        };

        // 대화 내역 저장
        const saveResult = await window.electronAPI.saveChatHistory([...currentHistory, newHistory]);
        
        if (!saveResult.success) {
          console.error("대화 내역 저장 실패:", saveResult.error);
        }

        return result.message;
      } else {
        throw new Error(result.error || '응답을 받아오는데 실패했습니다.');
      }
    } catch (error) {
      console.error("채팅 요청 실패:", error);
      await window.electronAPI.showMessageBox({
        type: "error",
        title: "요청 실패",
        message: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      });
      return null;
    }
  }, [apiKey, selectedPrompt]);

  // 폼 제출 처리
  const onSubmit = async () => {
    if (input.trim() === "" || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await handleSubmit(input);
      if (result) {
        setResponse(result);
      }
    } catch (error) {
      console.error("채팅 요청 실패:", error);
      await window.electronAPI.showMessageBox({
        type: "error",
        title: "요청 실패",
        message: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // 상태
    input,
    setInput,
    isLoading,
    response,
    images,
    isLoadingImages,
    selectedPromptName: selectedPrompt?.name,
    
    // 액션
    onSubmit
  };
}; 