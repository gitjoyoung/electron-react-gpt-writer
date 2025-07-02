import { useState } from 'react';
import { useAutomation } from './hooks/useAutomation';
import { AutomationInput } from './ui/AutomationInput';
import { AutomationProgress } from './ui/AutomationProgress';
import { useStore } from '../../shared/store/useStore';

interface Topic {
  id: number;
  name: string;
  period: string;
  topic: string;
}

export const Automation = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  // 필요한 상태만 선택적으로 구독
  const selectedPrompt = useStore(state => state.selectedPrompt);
  const {
    isRunning,
    currentTopic,
    progress,
    startAutomation,
    stopAutomation,
    completedTopicIds
  } = useAutomation();

  const handleTopicsChange = (newTopics: Topic[]) => {
    setTopics(newTopics);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-orange-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <h2 className="text-lg font-semibold text-gray-900">자동화</h2>
          <p className="text-sm text-orange-600">여러 주제를 한 번에 처리하세요</p>
          {selectedPrompt && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full font-medium">
              {selectedPrompt.name}
            </span>
          )}
        </div>
        {isRunning && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full">
            <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">실행 중</span>
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-6">
        <AutomationInput 
          topics={topics}
          onTopicsChange={handleTopicsChange}
          isRunning={isRunning}
          onStart={startAutomation}
          onStop={stopAutomation}
          currentTopicId={currentTopic?.id}
          completedTopicIds={completedTopicIds}
        />

        {isRunning && (
          <AutomationProgress 
            currentTopic={currentTopic}
            progress={progress}
            totalTopics={topics.length}
          />
        )}
      </div>
    </div>
  );
}; 