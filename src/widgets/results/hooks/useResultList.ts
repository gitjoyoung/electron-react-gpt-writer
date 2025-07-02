import { useState, useEffect, useCallback } from 'react';

interface ChatResult {
  timestamp: string;
  prompt: string;
  response: string;
  promptContent?: string;
}

interface ExportResult {
  success: boolean;
  error?: string;
}

export const useResultList = () => {
  const [results, setResults] = useState<ChatResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Electron API에서 결과 로드 (파일 기반)
  const loadResults = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI?.loadChatHistory) {
        const historyResult = await window.electronAPI.loadChatHistory();
        if (historyResult.success && historyResult.history) {
          // timestamp 기준으로 내림차순 정렬 (최신순)
          const sortedResults = historyResult.history.sort((a, b) => {
            const timeA = typeof a.timestamp === 'string' ? parseInt(a.timestamp) || 0 : a.timestamp;
            const timeB = typeof b.timestamp === 'string' ? parseInt(b.timestamp) || 0 : b.timestamp;
            return timeB - timeA;
          });
          setResults(sortedResults);
        } else {
          setResults([]);
        }
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('결과 로드 실패:', error);
      setError('결과를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 결과 로드
  useEffect(() => {
    loadResults();
  }, [loadResults]);

  // 파일 변경 감지를 위한 커스텀 이벤트
  useEffect(() => {
    const handleFileChanged = () => {
      loadResults();
    };

    // 파일 변경 알림 이벤트 리스너 등록
    window.addEventListener('chatHistoryChanged', handleFileChanged);

    return () => {
      window.removeEventListener('chatHistoryChanged', handleFileChanged);
    };
  }, [loadResults]);

  // 결과 저장 (새 결과 추가) - Electron API 사용
  const saveResult = useCallback(async (newResult: ChatResult) => {
    try {
      // 현재 히스토리 로드
      const historyResult = await window.electronAPI.loadChatHistory();
      const currentHistory = historyResult.success ? historyResult.history || [] : [];
      
             // 새 결과 추가 (맨 앞에) - promptContent가 undefined인 경우 빈 문자열로 처리
       const formattedResult = {
         ...newResult,
         promptContent: newResult.promptContent || ''
       };
       const updatedHistory = [formattedResult, ...currentHistory];
       
       // 파일에 저장
       const saveResult = await window.electronAPI.saveChatHistory(updatedHistory);
      
      if (saveResult.success) {
        // UI 상태 업데이트
        setResults(updatedHistory);
        return { success: true };
      } else {
        throw new Error(saveResult.error || '저장 실패');
      }
    } catch (error) {
      console.error('결과 저장 실패:', error);
      return { success: false, error: '결과 저장에 실패했습니다.' };
    }
  }, []);

  // 개별 결과 삭제 (파일 기반)
  const deleteResult = useCallback(async (timestamp: string): Promise<void> => {
    try {
      if (window.electronAPI?.deleteChatHistory) {
        await window.electronAPI.deleteChatHistory(timestamp);
        
        // 상태 업데이트 (UI에서 즉시 제거)
        setResults(prev => prev.filter(r => r.timestamp !== timestamp));
        setError(null);
      } else {
        throw new Error('Electron API를 사용할 수 없습니다.');
      }
    } catch (error) {
      console.error('결과 삭제 실패:', error);
      const errorMessage = '결과 삭제에 실패했습니다.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // 전체 결과 삭제 (파일 기반)
  const deleteAllResults = useCallback(async (): Promise<void> => {
    try {
      if (window.electronAPI?.deleteAllChatHistory) {
        await window.electronAPI.deleteAllChatHistory();
        
        // 상태 업데이트
        setResults([]);
        setError(null);
      } else {
        throw new Error('Electron API를 사용할 수 없습니다.');
      }
    } catch (error) {
      console.error('전체 결과 삭제 실패:', error);
      const errorMessage = '전체 결과 삭제에 실패했습니다.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // 엑셀 내보내기 (파일 기반)
  const exportResults = useCallback(async () => {
    try {
      // 파일에서 최신 데이터 로드
      const historyResult = await window.electronAPI.loadChatHistory();
      const currentResults = historyResult.success ? historyResult.history || [] : [];
      
      const excelData = currentResults.map((result: ChatResult) => {
        try {
          const parsedResponse = JSON.parse(result.response);
          return {
            timestamp: result.timestamp,
            prompt: result.prompt,
            ...parsedResponse,
            promptContent: result.promptContent
          };
        } catch {
          return {
            timestamp: result.timestamp,
            prompt: result.prompt,
            response: result.response,
            promptContent: result.promptContent
          };
        }
      });

      const result = await window.electronAPI.exportChatHistory(excelData) as ExportResult;

      if (!result.success && result.error !== '저장이 취소되었습니다.') {
        await window.electronAPI.showMessageBox({
          type: 'error',
          title: '내보내기 실패',
          message: result.error || '결과 내보내기에 실패했습니다.'
        });
      }
    } catch (error) {
      console.error('엑셀 내보내기 실패:', error);
      await window.electronAPI.showMessageBox({
        type: 'error',
        title: '내보내기 실패',
        message: '엑셀 내보내기 중 오류가 발생했습니다.'
      });
    }
  }, []);

  // JSON 내보내기 (파일 기반)
  const exportJsonResults = useCallback(async () => {
    try {
      // 파일에서 최신 데이터 로드
      const historyResult = await window.electronAPI.loadChatHistory();
      const currentResults = historyResult.success ? historyResult.history || [] : [];
      
      const jsonData = currentResults.map((result: ChatResult) => {
        try {
          return JSON.parse(result.response);
        } catch {
          return result.response;
        }
      });
      
      const result = await window.electronAPI.exportChatHistoryJson(jsonData) as ExportResult;

      if (!result.success && result.error !== '저장이 취소되었습니다.') {
        await window.electronAPI.showMessageBox({
          type: 'error',
          title: 'JSON 내보내기 실패',
          message: result.error || 'JSON 내보내기에 실패했습니다.'
        });
      }
    } catch (error) {
      console.error('JSON 내보내기 실패:', error);
      await window.electronAPI.showMessageBox({
        type: 'error',
        title: 'JSON 내보내기 실패',
        message: 'JSON 내보내기 중 오류가 발생했습니다.'
      });
    }
  }, []);

  const refreshResults = useCallback(() => {
    loadResults();
  }, [loadResults]);

  return {
    results,
    isLoading,
    error,
    deleteResult,
    deleteAllResults,
    exportResults,
    exportJsonResults,
    refreshResults,
    saveResult // 새 결과 추가용
  };
}; 