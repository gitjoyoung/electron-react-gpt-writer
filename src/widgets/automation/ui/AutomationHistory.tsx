import { useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import type { AutomationHistory as AutomationHistoryType } from '../types';

interface AutomationHistoryProps {
  history: AutomationHistoryType[];
  onDelete: (timestamp: string) => void;
  onExport: () => void;
}

export const AutomationHistory = ({
  history,
  onDelete,
  onExport
}: AutomationHistoryProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (timestamp: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(timestamp)) {
      newExpanded.delete(timestamp);
    } else {
      newExpanded.add(timestamp);
    }
    setExpandedItems(newExpanded);
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">처리 내역</h3>
        <Button onClick={onExport}>내보내기</Button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.timestamp}
            className="border rounded-lg overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleItem(item.timestamp)}
            >
              <div className="flex-1">
                <div className="font-medium">{item.topic}</div>
                <div className="text-sm text-gray-500">
                  {new Date(parseInt(item.timestamp)).toLocaleString()}
                </div>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.timestamp);
                }}
                className="text-red-500 hover:text-red-700"
              >
                삭제
              </Button>
            </div>

            {expandedItems.has(item.timestamp) && (
              <div className="p-4 bg-gray-50 border-t">
                <div className="whitespace-pre-wrap">{item.response}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 