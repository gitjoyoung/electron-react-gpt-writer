import { useChat } from "./hooks/useChat";
import type {
  PromptTemplate,
  UnsplashImage,
  ChatHistory,
} from "../../shared/api/electron";
import { useState, useEffect, useCallback } from "react";
import { ChatView } from "./ui/components/ChatView";
import { ChatResponseList } from "./ui/components/ChatResponseList";

interface ChatProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  selectedPrompt: PromptTemplate | null;
}

const parseResponse = (response: string) => {
  try {
    // JSON 형식인지 확인
    if (response.trim().startsWith('{') && response.trim().endsWith('}')) {
      return JSON.parse(response);
    }
    // 일반 텍스트인 경우
    return { content: response };
  } catch (e) {
    console.error('응답 파싱 실패:', e);
    return { content: response };
  }
};

const createHistoryEntry = (query: string, response: string): ChatHistory => {
  const parsedResponse = parseResponse(response);
  return {
    query,
    ...parsedResponse,
    timestamp: new Date().toISOString(),
  };
};

export const Chat = ({ apiKey, onApiKeyChange, selectedPrompt }: ChatProps) => {
  const { input, setInput, isLoading, response, handleSubmit } = useChat({
    apiKey,
    onApiKeyChange,
  });
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory | null>(null);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [selectedResponses, setSelectedResponses] = useState<ChatHistory[]>([]);
  const [allResponses, setAllResponses] = useState<ChatHistory[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>("");

  useEffect(() => {
    if (response) {
      setCurrentResponse(response);
    }
  }, [response]);

  useEffect(() => {
    if (currentResponse && currentQuery && !isLoading) {
      const historyEntry = createHistoryEntry(currentQuery, currentResponse);
      setChatHistory(historyEntry);
      setAllResponses(prev => {
        // 이미 같은 timestamp를 가진 항목이 있는지 확인
        const existingIndex = prev.findIndex(item => item.timestamp === historyEntry.timestamp);
        if (existingIndex !== -1) {
          // 있으면 해당 항목을 새로운 항목으로 교체
          const newResponses = [...prev];
          newResponses[existingIndex] = historyEntry;
          return newResponses;
        }
        // 없으면 새로운 항목 추가
        return [...prev, historyEntry];
      });
      setCurrentResponse(null); // 현재 응답 초기화
      setCurrentQuery(""); // 현재 쿼리 초기화
    }
  }, [currentResponse, currentQuery, isLoading]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!response) return;

      const searchTerm = response.split("\n")[0].slice(0, 50);

      setIsLoadingImages(true);
      try {
        const result = await window.electronAPI.fetchUnsplashImages(searchTerm);
        if (result.success) {
          setImages(result.images);
        }
      } catch (error) {
        console.error("이미지 검색 실패:", error);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, [response]);

  const onSubmit = async () => {
    if (input.trim() === "" || isLoading) return;
    setImages([]);
    setChatHistory(null);
    setCurrentQuery(input); // 현재 입력된 쿼리 저장
    handleSubmit(input, selectedPrompt);
  };

  const handleSelectionChange = (selected: ChatHistory[]) => {
    setSelectedResponses(selected);
  };

  const handleDeleteResponse = (timestamp: string) => {
    setAllResponses(prev => prev.filter(response => response.timestamp !== timestamp));
  };

  const handleExcelDownload = async () => {
    if (selectedResponses.length === 0) {
      await window.electronAPI.showMessageBox({
        type: "warning",
        title: "엑셀 다운로드",
        message: "선택된 대화 내역이 없습니다.",
      });
      return;
    }

    try {
      console.log('엑셀 저장할 데이터:', JSON.stringify(selectedResponses, null, 2));
      const result = await window.electronAPI.exportChatHistory(selectedResponses);
      
      if (result.success) {
        await window.electronAPI.showMessageBox({
          type: "info",
          title: "엑셀 다운로드",
          message: "선택한 대화 내역이 성공적으로 저장되었습니다.",
        });
      }
    } catch (error) {
      console.error("엑셀 다운로드 실패:", error);
      await window.electronAPI.showMessageBox({
        type: "error",
        title: "엑셀 다운로드",
        message: "대화 내역 저장에 실패했습니다.",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatView
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        response={response}
        onSubmit={onSubmit}
        images={images}
        isLoadingImages={isLoadingImages}
        chatHistory={chatHistory ? [chatHistory] : []}
        selectedPromptName={selectedPrompt?.name}
      />
      <ChatResponseList
        responses={allResponses}
        onSelectionChange={handleSelectionChange}
        onExcelDownload={handleExcelDownload}
        onDeleteResponse={handleDeleteResponse}
      />
    </div>
  );
};
