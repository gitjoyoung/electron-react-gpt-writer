import { useState, useRef, useEffect } from 'react';
import { Button } from '../../../shared/ui/Button';
import { cn } from '../../../shared/utils/cn';
import { useStore } from '../../../shared/store/useStore';

interface Topic {
  id: number;
  name: string;
  period: string;
  topic: string;
}

interface AutomationInputProps {
  topics: Topic[];
  onTopicsChange: (topics: Topic[]) => void;
  isRunning: boolean;
  onStart: (topics: Topic[]) => void;
  onStop: () => void;
  currentTopicId?: number;
  completedTopicIds?: number[];
}

export const AutomationInput = ({
  topics,
  onTopicsChange,
  isRunning,
  onStart,
  onStop,
  currentTopicId,
  completedTopicIds = []
}: AutomationInputProps) => {
  const [input, setInput] = useState('');
  // 필요한 상태만 선택적으로 구독
  const selectedPrompt = useStore(state => state.selectedPrompt);
  const currentTopicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTopicId && currentTopicRef.current) {
      currentTopicRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [currentTopicId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleAddTopics = () => {
    try {
      const newTopics = JSON.parse(input);
      if (!Array.isArray(newTopics)) {
        throw new Error('배열 형식이 아닙니다.');
      }

      // 각 항목의 필수 필드 검증
      const isValid = newTopics.every(topic => 
        typeof topic.id === 'number' &&
        typeof topic.name === 'string' &&
        typeof topic.period === 'string' &&
        typeof topic.topic === 'string'
      );

      if (!isValid) {
        throw new Error('올바른 형식이 아닙니다. 각 항목은 id, name, period, topic 필드를 포함해야 합니다.');
      }

      onTopicsChange([...topics, ...newTopics]);
      setInput('');
    } catch (error) {
      window.electronAPI.showMessageBox({
        type: 'error',
        title: '입력 오류',
        message: error instanceof Error ? error.message : 'JSON 형식이 올바르지 않습니다.'
      });
    }
  };

  const handleRemoveTopic = (id: number) => {
    const newTopics = topics.filter(topic => topic.id !== id);
    onTopicsChange(newTopics);
  };

  const handleStart = () => {
    if (!selectedPrompt) {
      window.electronAPI.showMessageBox({
        type: 'warning',
        title: '프롬프트 필요',
        message: '자동화를 시작하기 전에 프롬프트를 선택해주세요.'
      });
      return;
    }
    onStart(topics);
  };

  return (
    <div className="space-y-4">
      {/* 프롬프트 선택 안내 */}
      {!selectedPrompt && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium text-amber-800">프롬프트를 먼저 선택해주세요</span>
          </div>
          <p className="text-sm text-amber-700 mt-1">자동화를 실행하려면 왼쪽 프롬프트 섹션에서 프롬프트를 선택해야 합니다.</p>
        </div>
      )}

      {/* JSON 입력 영역 */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">주제 추가 (JSON 형식)</h4>
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder={`[
  {
    "id": 1,
    "name": "소크라테스",
    "period": "고대",
    "topic": "철학자 소개"
  }
]`}
            className="flex-1 p-3 border border-gray-200 rounded-lg resize-none h-28 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isRunning}
          />
          <Button
            onClick={handleAddTopics}
            disabled={isRunning || !input.trim()}
            className="px-4 py-2 self-start"
          >
            추가
          </Button>
        </div>
      </div>

      {/* 주제 목록 */}
      {topics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">주제 목록 ({topics.length}개)</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>진행 중</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>완료</span>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg">
            <div className="max-h-48 overflow-y-auto scrollbar-thin">
              {topics.map((topic, index) => (
                <div 
                  key={topic.id} 
                  ref={currentTopicId === topic.id ? currentTopicRef : null}
                  className={cn(
                    "flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0 transition-colors",
                    currentTopicId === topic.id && "bg-blue-50 border-blue-200",
                    completedTopicIds.includes(topic.id) && "bg-green-50 border-green-200",
                    !currentTopicId && !completedTopicIds.includes(topic.id) && "hover:bg-gray-50"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <span className="text-xs text-gray-500">#{topic.id}</span>
                      <span className="truncate">{topic.name}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                        {topic.period}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 truncate">{topic.topic}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleRemoveTopic(topic.id)}
                    disabled={isRunning}
                    variant="danger"
                    className="px-2 py-1 text-xs flex-shrink-0"
                  >
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 실행 버튼 */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={handleStart}
            disabled={topics.length === 0 || isRunning || !selectedPrompt}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              topics.length === 0 || isRunning || !selectedPrompt
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {isRunning ? '실행 중...' : '자동화 시작'}
          </button>

          {isRunning && (
            <button
              onClick={onStop}
              className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              중지
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 