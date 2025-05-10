import React from "react";
import type { ChatViewProps } from "../types";

export const ChatView = ({
  input,
  setInput,
  isLoading,
  response,
  onSubmit,
  images,
  isLoadingImages,
  selectedPromptName,
}: ChatViewProps) => {
  const handleSubmit = () => {
    console.log('전송할 프롬프트:', input);
    onSubmit();
  };

  return (
    <div className="flex flex-col bg-white rounded shadow-md">
      <div className="flex-1">
        {response && (
          <div className="max-h-[350px] bg-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="prose max-w-none">
              <div className="text-sm  whitespace-pre-wrap p-2 my-2 rounded-md bg-gray-200 border-b">
                {response}
              </div>
            </div>
            {images.length > 0 && (
              <div className="px-4 pb-4 grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-32 object-cover rounded shadow-sm"
                  />
                ))}
              </div>
            )}
            {isLoadingImages && (
              <div className="px-4 pb-4 text-center text-sm text-gray-500">
                이미지 로딩 중...
              </div>
            )}
          </div>
        )}
      </div>
      <div className="border-t p-4 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            placeholder={
              selectedPromptName
                ? `${selectedPromptName}에 대해 질문하세요`
                : "질문을 입력하세요"
            }
            className="flex-1 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "처리 중..." : "전송"}
          </button>
        </div>
      </div>
    </div>
  );
};
