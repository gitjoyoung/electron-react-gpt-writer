import React, { useState } from 'react';
import { ChatHistory } from '../../../../shared/api/electron';

interface ChatResponseListProps {
  responses: ChatHistory[];
  onSelectionChange: (selectedResponses: ChatHistory[]) => void;
  onExcelDownload: () => void;
  onDeleteResponse: (timestamp: string) => void;
}

export const ChatResponseList: React.FC<ChatResponseListProps> = ({ 
  responses,
  onSelectionChange,
  onExcelDownload,
  onDeleteResponse
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleCheckboxChange = (response: ChatHistory) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(response.timestamp)) {
      newSelectedIds.delete(response.timestamp);
    } else {
      newSelectedIds.add(response.timestamp);
    }
    setSelectedIds(newSelectedIds);
    
    const selectedResponses = responses.filter(r => 
      newSelectedIds.has(r.timestamp)
    );
    onSelectionChange(selectedResponses);
  };

  const toggleExpand = (timestamp: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(timestamp)) {
      newExpandedItems.delete(timestamp);
    } else {
      newExpandedItems.add(timestamp);
    }
    setExpandedItems(newExpandedItems);
  };

  const handleDelete = (timestamp: string) => {
    if (selectedIds.has(timestamp)) {
      const newSelectedIds = new Set(selectedIds);
      newSelectedIds.delete(timestamp);
      setSelectedIds(newSelectedIds);
      onSelectionChange(responses.filter(r => newSelectedIds.has(r.timestamp)));
    }
    onDeleteResponse(timestamp);
  };

  if (responses.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">대화 기록</h3>
        <button
          onClick={onExcelDownload}
          disabled={selectedIds.size === 0}
          className={`px-4 py-2 rounded-md text-white ${
            selectedIds.size === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          선택 항목 엑셀 저장
        </button>
      </div>
      <div className="overflow-y-auto pr-2 mb-8">
        <div className="flex flex-col gap-4">
          {responses.map((response, index) => (
            <div 
              key={response.timestamp} 
              className="flex items-start gap-3 bg-gray-50 rounded-lg p-2 shadow-sm"
            >
              <input
                type="checkbox"
                checked={selectedIds.has(response.timestamp)}
                onChange={() => handleCheckboxChange(response)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div 
                    className="font-bold text-gray-800 cursor-pointer hover:text-blue-600 flex items-center gap-2 text-xs"
                    onClick={() => toggleExpand(response.timestamp)}
                  >
                    <span className="flex items-center">질문: {response.query}</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      {expandedItems.has(response.timestamp) ? '▼' : '▶'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(response.timestamp);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 hover:underline"
                  >
                    삭제
                  </button>
                </div>
                {expandedItems.has(response.timestamp) && (
                  <>
                    <div className="text-gray-600 whitespace-pre-wrap h-[250px] overflow-y-auto">
                      {response.title && <h3 className="font-bold mb-2">{response.title}</h3>}
                      {response.content}
                      {response.nickname && <div className="mt-2 text-sm text-gray-500">작성자: {response.nickname}</div>}
                      {response.summary && <div className="mt-2 text-sm text-gray-500">요약: {response.summary}</div>}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      {new Date(response.timestamp).toLocaleString('ko-KR')}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 