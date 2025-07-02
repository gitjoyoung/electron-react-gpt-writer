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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-[600px]">
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-gray-100 bg-blue-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900">AI 채팅</h3>
          <p className="text-sm text-blue-600">AI와 대화하고 질문하세요</p>
          {selectedPromptName && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
              {selectedPromptName}
            </span>
          )}
        </div>
      </div>

      {/* 응답 영역 - 고정 높이 + 스크롤 */}
      <div className="flex-1 overflow-hidden min-h-0">
        {response ? (
          <div className="h-full overflow-y-auto scrollbar-thin">
            <div className="p-6">
              <div className="prose max-w-none">
                <div className="text-sm leading-relaxed whitespace-pre-wrap p-4 bg-blue-50 rounded-lg border border-blue-100">
                  {response}
                </div>
              </div>
              
              {/* 이미지 그리드 */}
              {images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {isLoadingImages && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-sm font-medium">이미지 생성 중...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">AI와 대화를 시작해보세요</p>
              <p className="text-sm text-gray-400">프롬프트를 선택하고 질문을 입력해주세요</p>
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 - 고정 */}
      <div className="border-t border-gray-100 p-4 bg-white flex-shrink-0">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && input.trim() && handleSubmit()}
            placeholder={
              selectedPromptName
                ? `${selectedPromptName}에 대해 질문하세요`
                : "질문을 입력하세요"
            }
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                처리 중
              </div>
            ) : (
              "전송"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
