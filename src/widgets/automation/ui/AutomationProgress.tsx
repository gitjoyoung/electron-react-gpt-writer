interface Topic {
  id: number;
  [key: string]: any;
}

interface AutomationProgressProps {
  currentTopic: Topic | null;
  progress: number;
  totalTopics: number;
}

export const AutomationProgress = ({
  currentTopic,
  progress,
  totalTopics
}: AutomationProgressProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          {currentTopic ? (
            <div>
              <div className="font-medium">현재 주제:</div>
              {Object.entries(currentTopic)
                .filter(([key]) => key !== 'id')
                .map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium">{key}:</span>{' '}
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
            </div>
          ) : (
            '처리 중...'
          )}
        </div>
        <div className="text-sm text-gray-500">
          {Math.round(progress)}%
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-sm text-gray-500 text-right">
        {Math.round(progress * totalTopics / 100)} / {totalTopics} 주제
      </div>
    </div>
  );
}; 