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

      // 더 나은 검색어 추출 로직
      let searchTerm = '';
      
      // 1. 사용자 입력에서 키워드 추출 (저장된 입력이 있다면)
      const chatHistory = await window.electronAPI.loadChatHistory();
      if (chatHistory.success && chatHistory.history && chatHistory.history.length > 0) {
        const lastChat = chatHistory.history[chatHistory.history.length - 1];
        const userInput = lastChat.prompt;
        
        // 사용자 입력이 짧고 명확한 경우 우선 사용
        if (userInput && userInput.length <= 50 && !userInput.includes('\n')) {
          searchTerm = userInput;
        }
      }
      
      // 2. 사용자 입력이 적절하지 않으면 응답에서 키워드 추출
      if (!searchTerm) {
        // 응답에서 첫 번째 의미 있는 문장이나 제목 추출
        const lines = response.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
          // 첫 번째 줄이 제목 형태인 경우 사용
          let firstLine = lines[0].trim();
          
          // 마크다운 헤더 제거
          firstLine = firstLine.replace(/^#+\s*/, '');
          
          // 특수 문자 제거하고 핵심 키워드만 추출
          firstLine = firstLine.replace(/[#*_\[\]()]/g, '').trim();
          
          // 50자로 제한
          searchTerm = firstLine.slice(0, 50);
        }
      }
      
      // 3. 그래도 없으면 기본값
      if (!searchTerm) {
        searchTerm = 'nature';
      }

      console.log('이미지 검색어:', searchTerm);

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