import React, { useRef, useState } from 'react';

interface PostUploadFormProps {
  posts: any[];
  isProcessing: boolean;
  currentIndex: number;
  totalCount: number;
  delay: number;
  error: string | null;
  successCount: number;
  failureCount: number;
  onFileUpload: (file: File) => void;
  onSetDelay: (delayMs: number) => void;
  onStartProcessing: () => void;
  onStopProcessing: () => void;
  onReset: () => void;
}

export const PostUploadForm: React.FC<PostUploadFormProps> = ({
  posts,
  isProcessing,
  currentIndex,
  totalCount,
  delay,
  error,
  successCount,
  failureCount,
  onFileUpload,
  onSetDelay,
  onStartProcessing,
  onStopProcessing,
  onReset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [delayInput, setDelayInput] = useState(Math.floor(delay / 1000).toString());

  // 초를 시, 분, 초로 변환하는 함수
  const formatTime = (seconds: number) => {
    if (seconds === 0) return '';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}시간`);
    if (minutes > 0) parts.push(`${minutes}분`);
    if (remainingSeconds > 0) parts.push(`${remainingSeconds}초`);
    
    return parts.join(' ');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDelayInput(value);
    
    // 숫자 검증 및 밀리초로 변환
    const seconds = parseInt(value);
    if (!isNaN(seconds) && seconds > 0) {
      onSetDelay(seconds * 1000);
    }
  };

  const progress = totalCount > 0 ? (currentIndex / totalCount) * 100 : 0;
  const estimatedMinutes = totalCount > 0 ? Math.ceil((totalCount - 1) * delay / 60000) : 0;
  const currentDelaySeconds = parseInt(delayInput) || 0;
  const formattedDelay = formatTime(currentDelaySeconds);

  return (
    <div className="space-y-6">
      {/* 파일 업로드 섹션 */}
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleFileButtonClick}
              className="text-teal-600 hover:text-teal-500 font-medium"
              disabled={isProcessing}
            >
              JSON 파일 선택
            </button>
            <p className="text-sm text-gray-500 mt-1">PostData 배열 형식의 JSON 파일을 업로드하세요</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* 파일 정보 */}
      {totalCount > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">업로드된 파일 정보</h4>
          <div className="text-sm text-gray-600">
            <p>총 포스트 수: {totalCount}개</p>
            <p>예상 소요 시간: {estimatedMinutes}분</p>
          </div>
        </div>
      )}

      {/* 딜레이 설정 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          포스트 간 딜레이 (초)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            max="3600"
            value={delayInput}
            onChange={handleDelayChange}
            className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center"
            disabled={isProcessing}
            placeholder="30"
          />
          <span className="text-sm text-gray-500">초</span>
          {formattedDelay && (
            <div className="text-sm text-blue-600 font-medium">
              = {formattedDelay}
            </div>
          )}
          <div className="text-xs text-gray-400">
            (1초 ~ 1시간)
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          포스트 업로드 간격을 설정하세요. 너무 짧으면 서버에 부하가 될 수 있습니다.
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-700 text-sm font-medium">검증 오류</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 진행 상황 */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">업로드 진행 중...</span>
            <span className="text-sm text-blue-600">{currentIndex} / {totalCount}</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-blue-600">
            성공: {successCount}개, 실패: {failureCount}개
          </div>
        </div>
      )}

      {/* 완료 상태 */}
      {!isProcessing && currentIndex > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700 text-sm font-medium">
              업로드 완료! 성공: {successCount}개, 실패: {failureCount}개
            </p>
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          disabled={isProcessing}
        >
          초기화
        </button>
        
        {isProcessing ? (
          <button
            type="button"
            onClick={onStopProcessing}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              중지
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={onStartProcessing}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
            disabled={totalCount === 0}
          >
            배치 업로드 시작
          </button>
        )}
      </div>
    </div>
  );
}; 