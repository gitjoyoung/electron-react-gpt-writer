import React from "react";
import { ResultList } from "./ui/ResultList";
import { useResultList } from "./hooks/useResultList";

export const Results: React.FC = () => {
  const {
    results,
    isLoading,
    error,
    deleteResult,
    exportResults,
  } = useResultList();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">결과 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">결과 목록</h2>
        <button
        
          onClick={exportResults}
          disabled={results.length === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          전체 내보내기
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <ResultList
          results={results}
          onDelete={deleteResult}
        />
      </div>
    </div>
  );
};
