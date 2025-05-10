import { useState } from 'react';
import { useAutomation } from './hooks/useAutomation';
import { AutomationInput } from './ui/AutomationInput';
import { AutomationProgress } from './ui/AutomationProgress';

interface Topic {
  id: number;
  name: string;
  period: string;
  topic: string;
}

export const Automation = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
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
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <h2 className="text-lg font-bold">자동화</h2>
      
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
  );
}; 