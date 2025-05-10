import React from 'react';
import { ResultItem } from './ResultItem';
import type { ChatHistory } from '../../../shared/api/electron';

interface ResultListProps {
  results: ChatHistory[];
  onDelete: (timestamp: string) => Promise<void>;
}

export const ResultList: React.FC<ResultListProps> = ({ results, onDelete }) => {
  // results가 undefined나 null인 경우 빈 배열로 처리
  const safeResults = results || [];

  // 결과가 없는 경우 메시지 표시
  if (safeResults.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {safeResults.map((result, index) => {
        // 필수 속성 검사
        if (!result || !result.timestamp) {
          console.warn('유효하지 않은 결과 항목이 있습니다:', result);
          return null;
        }

        return (
          <ResultItem
            key={`${result.timestamp}-${index}`}
            result={result}
            onDelete={async (timestamp) => {
              try {
                await onDelete(timestamp);
              } catch (error) {
                console.error('결과 삭제 중 오류 발생:', error);
                // 여기서 에러 처리를 추가할 수 있습니다 (예: 토스트 메시지)
              }
            }}
          />
        );
      })}
    </div>
  );
}; 