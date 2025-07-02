import { useCallback, useEffect, useState } from 'react';
import { useStore } from '../../../shared/store/useStore';
import type { ChatMessage } from '../types';

export const useChat = () => {
  // 전역 상태 (정말 필요한 것들만)
  const apiKey = useStore(state => state.apiKey);
  const selectedPrompt = useStore(state => state.selectedPrompt);
  
  // 내부 상태들
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState(selectedPrompt);
  const [lastUserInput, setLastUserInput] = useState('');

  // 로컬 스토리지 키
  const CHAT_STORAGE_KEY = 'current-chat-session';

  // 컴포넌트 마운트 시 저장된 채팅 복원
  useEffect(() => {
    try {
      const savedChat = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedChat) {
        const chatData = JSON.parse(savedChat);
        setMessages(chatData.messages || []);
        setResponse(chatData.response || '');
        setLastUserInput(chatData.lastUserInput || '');
      }
    } catch (error) {
      console.error('저장된 채팅 복원 실패:', error);
    }
  }, []);

  // 선택된 프롬프트가 변경될 때 현재 프롬프트 업데이트
  useEffect(() => {
    setCurrentPrompt(selectedPrompt);
  }, [selectedPrompt]);

  // 채팅 상태가 변경될 때마다 자동 저장
  useEffect(() => {
    if (messages.length > 0 || response) {
      const chatData = {
        messages,
        response,
        lastUserInput,
        timestamp: Date.now()
      };
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatData));
    }
  }, [messages, response, lastUserInput]);

  // 메시지 추가 함수
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // 채팅 제출 처리
  const handleSubmit = useCallback(async (userInput: string) => {
    if (!apiKey) {
      await window.electronAPI.showMessageBox({
        type: "warning",
        title: "API 키 필요",
        message: "OpenAI API 키를 입력해주세요.",
      });
      return null;
    }

    // 사용자 입력을 저장
    setLastUserInput(userInput);

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userInput,
      timestamp: Date.now()
    };
    addMessage(userMessage);

    // 프롬프트가 있는 경우 사용자 입력을 먼저 배치하고 프롬프트 내용을 추가
    let message = selectedPrompt 
      ? `${userInput}\n\n${selectedPrompt.content}`
      : userInput;

    // 프롬프트가 있고 반환 형식이 지정된 경우
    if (selectedPrompt?.responseFormat) {
      message += `\n\n반환 형식: ${selectedPrompt.responseFormat}`;
    }

    // 프롬프트가 있고 속성이 지정된 경우
    if (selectedPrompt?.columns && selectedPrompt.columns.length > 0) {
      message += `\n\n다음 속성을 반드시 포함해주세요: ${selectedPrompt.columns.join(', ')}`;
    }

    try {
      console.log("전송할 메시지:", message);
      const result = await window.electronAPI.chatGPT(message, apiKey);

      if (result.success && result.message) {
        // AI 응답 메시지 추가
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: result.message,
          timestamp: Date.now()
        };
        addMessage(assistantMessage);

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
  }, [apiKey, selectedPrompt, addMessage]);

  // 폼 제출 처리
  const onSubmit = async () => {
    if (input.trim() === "" || isLoading) return;
    
    const userInput = input.trim();
    setInput(''); // 입력창 즉시 클리어
    setIsLoading(true);
    
    try {
      const result = await handleSubmit(userInput);
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

  // 현재 대화를 결과에 저장 (파일 기반)
  const saveToResults = async () => {
    if (!response) {
      await window.electronAPI.showMessageBox({
        type: "warning",
        title: "저장할 내용 없음",
        message: "저장할 대화 내용이 없습니다."
      });
      return;
    }

    try {
      const timestamp = new Date().toISOString();
      const chatData = {
        timestamp,
        prompt: lastUserInput, // 사용자가 입력한 질문
        response,
        promptContent: currentPrompt?.content || ''
      };

      // 파일에서 현재 히스토리 로드
      const historyResult = await window.electronAPI.loadChatHistory();
      const currentHistory = historyResult.success ? historyResult.history || [] : [];
      
      // 새 결과를 맨 앞에 추가
      const updatedHistory = [chatData, ...currentHistory];
      
      // 파일에 저장
      const saveResult = await window.electronAPI.saveChatHistory(updatedHistory);
      
      if (saveResult.success) {
        // Results 위젯에 변경사항 알림 (커스텀 이벤트 발생)
        window.dispatchEvent(new Event('chatHistoryChanged'));

        await window.electronAPI.showNotification(
          '저장 완료',
          '대화가 결과 목록에 저장되었습니다.',
          'success'
        );
      } else {
        throw new Error(saveResult.error || '저장 실패');
      }
    } catch (error) {
      await window.electronAPI.showMessageBox({
        type: "error",
        title: "저장 실패",
        message: error instanceof Error ? error.message : "저장 중 오류가 발생했습니다."
      });
    }
  };

  // 새 대화 시작
  const startNewChat = () => {
    setInput('');
    setResponse('');
    setMessages([]);
    setLastUserInput('');
    setIsLoading(false);
    // 로컬 스토리지에서도 제거
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  return {
    // 상태
    input,
    setInput,
    isLoading,
    response,
    messages,
    selectedPromptName: selectedPrompt?.name,
    
    // 액션
    onSubmit,
    saveToResults,
    startNewChat
  };
}; 