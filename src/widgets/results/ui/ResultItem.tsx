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
    await onDelete(result.timestamp);
  };

  return (
    <div className="bg-white rounded-lg shadow p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <button
            onClick={handleToggle}
            className="text-gray-500 hover:text-gray-700 flex-shrink-0"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-900 truncate flex-1">
                {result.prompt}
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                - {result.timestamp}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 px-2 py-0.5 text-xs flex-shrink-0 ml-2"
        >
          삭제
        </button>
      </div>
      {isExpanded && (
        <div className="mt-3 space-y-3">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm font-medium text-gray-700 mb-1">질문</div>
            <div className="text-sm text-gray-600 whitespace-pre-wrap">
              {result.promptContent}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm font-medium text-gray-700 mb-1">답변</div>
            <div className="text-sm text-gray-600 whitespace-pre-wrap">
              {result.response}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
