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
    exportJsonResults,
  } = useResultList();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">결과 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-[600px] flex flex-col">
      <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-green-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h2 className="text-lg font-semibold text-gray-900">결과 목록</h2>
          <p className="text-sm text-green-600">{results.length}개의 결과</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportJsonResults}
            disabled={results.length === 0}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            JSON 내보내기
          </button>
          <button
            onClick={exportResults}
            disabled={results.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            엑셀 내보내기
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden min-h-0">
        {results.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">아직 결과가 없습니다</p>
              <p className="text-sm text-gray-400">AI와 대화하거나 자동화를 실행해보세요</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto scrollbar-thin">
            <ResultList
              results={results}
              onDelete={deleteResult}
            />
          </div>
        )}
      </div>
    </div>
  );
};
