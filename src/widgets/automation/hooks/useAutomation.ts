import { useState, useCallback, useRef } from 'react';
import { useStore } from '../../../shared/store/useStore';
import type { AutomationResult } from '../../../shared/api/electron';

interface Topic {
  id: number;
  name: string;
  period: string;
  topic: string;
}

export const useAutomation = () => {
  const { apiKey, selectedPrompt } = useStore();
  const [isRunning, setIsRunning] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [progress, setProgress] = useState(0);
  const [completedTopicIds, setCompletedTopicIds] = useState<number[]>([]);
  
  // 중지 상태를 ref로 관리하여 비동기 작업 중에도 즉시 반영되도록 함
  const stopRef = useRef(false);

  const generatePrompt = (topic: Topic): string => {
    return `${topic.name} (${topic.period})에 대해 ${topic.topic}해주세요.`;
  };

  // JSON 응답에서 ```json과 ```를 제거하는 함수
  const cleanJsonResponse = (response: string): string => {
    return response.replace(/^```json\n|\n```$/g, '');
  };

  const startAutomation = useCallback(async (topicsToProcess: Topic[]) => {
    if (!apiKey) {
      await window.electronAPI.showMessageBox({
        type: "warning",
        title: "API 키 필요",
        message: "OpenAI API 키를 입력해주세요.",
      });
      return;
    }

    if (!selectedPrompt) {
      await window.electronAPI.showMessageBox({
        type: "warning",
        title: "프롬프트 필요",
        message: "프롬프트를 선택해주세요.",
      });
      return;
    }

    // 초기화
    setIsRunning(true);
    stopRef.current = false;
    setProgress(0);
    setCompletedTopicIds([]);

    try {
      for (let i = 0; i < topicsToProcess.length; i++) {
        // 중지 체크
        if (stopRef.current) {
          console.log('자동화가 중지되었습니다.');
          break;
        }

        const topic = topicsToProcess[i];
        setCurrentTopic(topic);
        setProgress((i / topicsToProcess.length) * 100);

        try {
          const prompt = generatePrompt(topic);
          
          // 비동기 작업 전 중지 상태 체크
          if (stopRef.current) {
            console.log('자동화가 중지되었습니다.');
            break;
          }

          // 프롬프트 구성
          let message = `${prompt}\n\n${selectedPrompt.content}`;

          // 반환 형식이 지정된 경우
          if (selectedPrompt.responseFormat) {
            message += `\n\n반환 형식: ${selectedPrompt.responseFormat}`;
          }

          // 속성이 지정된 경우
          if (selectedPrompt.columns && selectedPrompt.columns.length > 0) {
            message += `\n\n다음 속성을 반드시 포함해주세요: ${selectedPrompt.columns.join(', ')}`;
          }

          // JSON 응답 형식 지시사항 추가
          message += `\n\n응답은 순수한 JSON 형식으로만 작성해주세요. \`\`\`json이나 \`\`\`와 같은 마크다운 문법은 사용하지 마세요.`;

          // API로 보낼 프롬프트 출력
          console.log('=== API 요청 프롬프트 ===');
          console.log(message);
          console.log('======================');

          // 실제 통신
          const result = await window.electronAPI.chatGPT(message, apiKey);

          if (!result.success) {
            await window.electronAPI.showMessageBox({
              type: "error",
              title: "통신 오류",
              message: result.error || "통신 중 오류가 발생했습니다."
            });
            return;
          }

          // GPT 답변이 완전히 도착할 때까지 대기
          if (!result.message) {
            await window.electronAPI.showMessageBox({
              type: "error",
              title: "응답 오류",
              message: "GPT 답변이 비어있습니다."
            });
            return;
          }

          console.log('=== 응답 결과 ===');
          console.log('변환된 채팅 내역:', (result.message, null, 2));

          // JSON 응답에서 ```json과 ```를 제거
          const cleanedResponse = cleanJsonResponse(result.message);
          console.log('cleanedResponse:', cleanedResponse);
          console.log('======================');

          const automationResult = {
            ...topic,
            prompt: topic.name,
            response: cleanedResponse,
            promptContent: selectedPrompt?.content || topic.name,
            timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
          };

          setCompletedTopicIds(prev => [...prev, topic.id]);

          // 현재 저장된 대화 내역 로드
          const historyResult = await window.electronAPI.loadChatHistory();
          const currentHistory = historyResult.success ? historyResult.history || [] : [];

          // 새로운 대화 내역 생성
          const newHistory = {
            timestamp: automationResult.timestamp,
            prompt: topic.name,
            response: cleanedResponse,
            promptContent: selectedPrompt?.content || topic.name
          };

          // 대화 내역 저장
          await window.electronAPI.saveChatHistory([...currentHistory, newHistory]);

          console.log('=== 항목 처리 완료 ===');
          console.log('처리된 항목:', topic.name);
          console.log('================');

        } catch (error) {
          if (error instanceof Error && error.message === '자동화가 중지되었습니다.') {
            console.log('자동화가 중지되었습니다.');
            break;
          }
          console.error('항목 처리 실패:', error);
        }
      }
    } finally {
      // 작업 완료 후 상태 초기화
      setIsRunning(false);
      setCurrentTopic(null);
      setProgress(stopRef.current ? 0 : 100);
    }
  }, [apiKey, selectedPrompt]);

  const stopAutomation = useCallback(() => {
    console.log('자동화 중지 요청됨');
    stopRef.current = true;
    setIsRunning(false);
    setCurrentTopic(null);
    setProgress(0);
  }, []);

  return {
    isRunning,
    currentTopic,
    progress,
    startAutomation,
    stopAutomation,
    completedTopicIds
  };
}; 