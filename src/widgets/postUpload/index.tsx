import React from 'react';
import { usePostUpload } from './hooks/usePostUpload';
import { PostUploadForm } from './ui/PostUploadForm';

export const PostUpload = () => {
  const {
    posts,
    isProcessing,
    currentIndex,
    totalCount,
    delay,
    error,
    successCount,
    failureCount,
    handleFileUpload,
    setDelay,
    startProcessing,
    stopProcessing,
    reset
  } = usePostUpload();
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-teal-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
          <h2 className="text-lg font-semibold text-gray-900">배치 포스트 업로드</h2>
          <p className="text-sm text-teal-600">JSON 파일로 여러 포스트를 한번에 업로드하세요</p>
        </div>
        {isProcessing && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">처리 중</span>
          </div>
        )}
        {!isProcessing && currentIndex > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm font-medium">완료</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <PostUploadForm
          posts={posts}
          isProcessing={isProcessing}
          currentIndex={currentIndex}
          totalCount={totalCount}
          delay={delay}
          error={error}
          successCount={successCount}
          failureCount={failureCount}
          onFileUpload={handleFileUpload}
          onSetDelay={setDelay}
          onStartProcessing={startProcessing}
          onStopProcessing={stopProcessing}
          onReset={reset}
        />
      </div>
    </div>
  );
}; 