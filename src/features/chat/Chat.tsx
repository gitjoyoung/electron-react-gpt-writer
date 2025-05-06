import { useChat } from "./hooks/useChat";
import type { PromptTemplate, UnsplashImage, ChatHistory } from "../../shared/api/electron";
import { useState, useEffect } from "react";
import { ChatView } from "./ui/components/ChatView";

interface ChatProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  selectedPrompt: PromptTemplate | null;
}

export const Chat = ({ apiKey, onApiKeyChange, selectedPrompt }: ChatProps) => {
  const { input, setInput, isLoading, response, handleSubmit } = useChat({
    apiKey,
    onApiKeyChange,
  });
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!response) return;
      
      const searchTerm = response.split('\n')[0].slice(0, 50);
      
      setIsLoadingImages(true);
      try {
        const result = await window.electronAPI.fetchUnsplashImages(searchTerm);
        if (result.success) {
          setImages(result.images);
        }
      } catch (error) {
        console.error('이미지 검색 실패:', error);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, [response]);

  const onSubmit = async () => {
    if (input.trim() === "" || isLoading) return;
    setImages([]);
    handleSubmit(input, selectedPrompt);
  };

  useEffect(() => {
    if (response && input) {
      const historyEntry: ChatHistory = {
        query: input,
        response: response,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, historyEntry]);
    }
  }, [response, input]);

  const handleExcelDownload = async () => {
    if (chatHistory.length === 0) return;
    
    try {
      const result = await window.electronAPI.exportChatHistory(chatHistory);
      if (result.success) {
        await window.electronAPI.showMessageBox({
          type: 'info',
          title: '엑셀 다운로드',
          message: '채팅 내역이 성공적으로 저장되었습니다.'
        });
      }
    } catch (error) {
      console.error('엑셀 다운로드 실패:', error);
      await window.electronAPI.showMessageBox({
        type: 'error',
        title: '엑셀 다운로드',
        message: '채팅 내역 저장에 실패했습니다.'
      });
    }
  };

  return (
    <ChatView
      input={input}
      setInput={setInput}
      isLoading={isLoading}
      response={response}
      onSubmit={onSubmit}
      images={images}
      isLoadingImages={isLoadingImages}
      chatHistory={chatHistory}
      selectedPromptName={selectedPrompt?.name}
      onExcelDownload={handleExcelDownload}
    />
  );
};
