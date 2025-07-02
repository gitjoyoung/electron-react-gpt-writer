import React from "react";
import type { ChatHistory } from "../../../shared/api/electron";

interface ResultItemProps {
  result: ChatHistory;
  onDelete: (timestamp: string) => Promise<void>;
}

export const ResultItem: React.FC<ResultItemProps> = ({ result, onDelete }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = async () => {
    try {
      // Electron API의 messageBox 사용 (non-blocking)
      const confirmation = await window.electronAPI.showMessageBox({
        type: 'question',
        title: '삭제 확인',
        message: '이 결과를 삭제하시겠습니까?',
        buttons: ['삭제', '취소'],
        defaultId: 1,
        cancelId: 1
      });

      if (confirmation.response === 0) { // "삭제" 버튼 클릭
        await onDelete(result.timestamp);
      }
    } catch (error) {
      console.error('삭제 처리 중 오류 발생:', error);
      // 에러 알림도 Electron API 사용
      await window.electronAPI.showMessageBox({
        type: 'error',
        title: '삭제 실패',
        message: '삭제 중 오류가 발생했습니다. 다시 시도해주세요.',
        buttons: ['확인']
      });
    }
  };

  // 질문 내용 가져오기 - prompt가 빈 값이면 promptContent 사용
  const questionText = result.prompt && result.prompt.trim() 
    ? result.prompt 
    : result.promptContent || '질문 내용 없음';

  // 날짜 포맷팅
  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={handleToggle}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-1 transition-colors"
              title={isExpanded ? "접기" : "펼치기"}
            >
              <svg className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-5">
                  {questionText}
                </h3>
                <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                  {formatDate(result.timestamp)}
                </span>
              </div>
              
              {!isExpanded && (
                <div className="text-sm text-gray-600 line-clamp-2 leading-5">
                  {result.response && result.response.length > 100 
                    ? `${result.response.substring(0, 100)}...`
                    : result.response
                  }
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 flex-shrink-0 p-1 rounded transition-colors"
            title="삭제"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-sm font-semibold text-gray-800">질문</h4>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border">
              {questionText}
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-sm font-semibold text-gray-800">답변</h4>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border">
              {result.response}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
