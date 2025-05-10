import { useState, useRef, useEffect } from 'react';
import { Button } from '../../../shared/ui/Button';
import { cn } from '../../../shared/utils/cn';

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

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
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
          className="flex-1 p-2 border rounded resize-none h-32 font-mono text-sm"
          disabled={isRunning}
        />
        <Button
          onClick={handleAddTopics}
          disabled={isRunning || !input.trim()}
        >
          추가
        </Button>
      </div>

      {topics.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">주제 목록</h3>
          <div className="space-y-2 h-40 overflow-y-auto">
            {topics.map((topic) => (
              <div 
                key={topic.id} 
                ref={currentTopicId === topic.id ? currentTopicRef : null}
                className={cn(
                  "flex items-center gap-2 p-2 h-8 rounded",
                  currentTopicId === topic.id && "bg-blue-100 border border-blue-500 text-blue-700",
                  completedTopicIds.includes(topic.id) && "bg-green-100 border border-green-500 text-green-700",
                  !currentTopicId && !completedTopicIds.includes(topic.id) && "bg-gray-50 hover:bg-gray-100"
                )}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{topic.id + "  " + topic.name + " - " + topic.period}</div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleRemoveTopic(topic.id)}
                  disabled={isRunning}
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        {isRunning ? (
          <Button onClick={onStop} className="bg-red-500 hover:bg-red-600">
            중지
          </Button>
        ) : (
          <Button
            onClick={() => onStart(topics)}
            disabled={topics.length === 0}
          >
            시작
          </Button>
        )}
      </div>
    </div>
  );
}; 