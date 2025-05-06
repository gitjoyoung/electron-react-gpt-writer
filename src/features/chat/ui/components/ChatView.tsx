import { Button } from "../../../../shared/ui/Button";
import type { UnsplashImage } from "../../../../shared/api/electron";
import type { ChatHistory } from "../../model/types";
import { ChatInput } from "./ChatInput";
import { ChatResponse } from "./ChatResponse";

interface ChatViewProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  response: string | null;
  onSubmit: () => void;
  images: UnsplashImage[];
  isLoadingImages: boolean;
  chatHistory: ChatHistory[];
  selectedPromptName?: string;
  onExcelDownload: () => void;
}

export const ChatView = ({
  input,
  setInput,
  isLoading,
  response,
  onSubmit,
  images,
  isLoadingImages,
  chatHistory,
  selectedPromptName,
  onExcelDownload
}: ChatViewProps) => {
  return (
    <div className="min-w-sm bg-white rounded-lg shadow-md p-3">
      <div className="flex flex-col gap-4 justify-between items-center">
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={onSubmit}
          isLoading={isLoading}
          selectedPromptName={selectedPromptName}
        />

        {response && (
          <ChatResponse 
            response={response} 
            isLoadingImages={isLoadingImages}
            images={images}
          />
        )}

        {chatHistory.length > 0 && (
          <div className="flex justify-end mt-4">
            <Button
              onClick={onExcelDownload}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              엑셀로 내보내기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}; 