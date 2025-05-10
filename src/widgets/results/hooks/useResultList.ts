import { useState, useEffect } from 'react';
import { ChatResponse } from '../types';
import type { ChatHistory } from '../../../shared/api/electron';

// ChatHistory를 ChatResponse로 변환하는 함수
const convertToChatResponse = (history: ChatHistory): ChatResponse => ({
    id: history.timestamp,
    timestamp: history.timestamp,
    prompt: history.prompt,
    response: history.response,
    images: [] // ChatHistory에는 images 필드가 없으므로 빈 배열로 설정
});

interface ExportResult {
    success: boolean;
    error?: string;
}

export const useResultList = () => {
    const [results, setResults] = useState<ChatHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadResults = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await window.electronAPI.loadChatHistory();
            if (result.success && result.history) {
                setResults(result.history);
            } else {
                throw new Error(result.error || '결과를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 초기 로드
    useEffect(() => {
        loadResults();
    }, []);

    // 채팅 내역 변경 감지
    useEffect(() => {
        const checkForUpdates = async () => {
            const result = await window.electronAPI.loadChatHistory();
            if (result.success && result.history) {
                setResults(result.history);
            }
        };

        // 1초마다 채팅 내역 확인
        const interval = setInterval(checkForUpdates, 1000);

        return () => clearInterval(interval);
    }, []);

    const deleteResult = async (timestamp: string) => {
        try {
            const result = await window.electronAPI.loadChatHistory();
            if (!result.success || !result.history) {
                throw new Error('결과 목록을 불러오는데 실패했습니다.');
            }

            const updatedResults = result.history.filter(r => r.timestamp !== timestamp);
            const saveResult = await window.electronAPI.saveChatHistory(updatedResults);

            if (!saveResult.success) {
                throw new Error(saveResult.error || '결과 삭제에 실패했습니다.');
            }

            setResults(updatedResults);
        } catch (error) {
            setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        }
    };

    const exportResults = async () => {
        try {
            // 엑셀에 맞게 데이터 변환
            const excelData = results.map(result => {
                try {
                    // response를 JSON으로 파싱
                    const parsedResponse = JSON.parse(result.response);
                    return {
                        timestamp: result.timestamp,
                        prompt: result.prompt,
                        ...parsedResponse,
                        promptContent: result.promptContent
                    };
                } catch (e) {
                    console.warn('Response 파싱 실패:', e);
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
            await window.electronAPI.showMessageBox({
                type: 'error',
                title: '내보내기 실패',
                message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
            });
        }
    };

    const exportJsonResults = async () => {
        try {
            const jsonData = results.map(result => {
                try {
                    return JSON.parse(result.response);
                } catch (e) {
                    console.warn('Response 파싱 실패:', e);
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
            await window.electronAPI.showMessageBox({
                type: 'error',
                title: 'JSON 내보내기 실패',
                message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
            });
        }
    };

    return {
        results,
        isLoading,
        error,
        deleteResult,
        exportResults,
        exportJsonResults,
        refreshResults: loadResults
    };
}; 