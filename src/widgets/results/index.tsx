import React, { useState } from "react";
import { ResultList } from "./ui/ResultList";
import { useResultList } from "./hooks/useResultList";

export const Results: React.FC = () => {
  const {
    results,
    isLoading,
    error,
    deleteResult,
    deleteAllResults,
    exportResults,
    exportJsonResults,
    refreshResults,
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
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={refreshResults}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-[600px] flex flex-col">
      {/* 헤더 - 세로 레이아웃 */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 flex-shrink-0">
        {/* 제목 영역 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
          <h2 className="text-xl font-bold text-gray-900">결과 목록</h2>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              {results.length}개
            </span>
            {results.length > 0 && (
              <span className="text-sm text-green-600">저장된 대화</span>
            )}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={refreshResults}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-all hover:shadow-md"
            title="목록 새로고침"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            새로고침
          </button>
          <button
            onClick={exportJsonResults}
            disabled={results.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all hover:shadow-md"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            JSON 내보내기
          </button>
          <button
            onClick={exportResults}
            disabled={results.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:shadow-md"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            엑셀 내보내기
          </button>
          <div className="flex-1"></div> {/* 공간 분리 */}
                    <button
            onClick={async () => {
              // Electron API의 messageBox 사용 (non-blocking)
              try {
                const result = await window.electronAPI.showMessageBox({
                  type: 'question',
                  title: '전체 삭제 확인',
                  message: '모든 결과를 삭제하시겠습니까?',
                  buttons: ['삭제', '취소'],
                  defaultId: 1,
                  cancelId: 1
                });

                if (result.response === 0) { // "삭제" 버튼 클릭
                  await deleteAllResults();
                }
              } catch (error) {
                console.error('전체 삭제 중 오류 발생:', error);
              }
            }}
            disabled={results.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:shadow-md"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            전체 삭제
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        {results.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">아직 결과가 없습니다</p>
              <p className="text-sm text-gray-400">
                AI와 대화하고 "결과에 저장" 버튼을 눌러보세요
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto scrollbar-thin">
            <ResultList 
              results={results as ChatHistory[]} 
              onDelete={async (timestamp: string) => {
                try {
                  await deleteResult(timestamp);
                } catch (error) {
                  console.error('결과 삭제 중 오류 발생:', error);
                  // 에러가 발생해도 UI가 블로킹되지 않도록 처리
                }
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};
