import React from 'react';
import type { SavedApiKeysProps } from '../types';
import { Button } from '../../../shared/ui/Button';

export const SavedApiKeys: React.FC<SavedApiKeysProps> = ({
  savedApiKeys,
  onSelectApiKey,
  onDeleteApiKey
}) => {
  if (savedApiKeys.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2">저장된 API 키</h3>
      <div className="space-y-2">
        {savedApiKeys.map((key) => (
          <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <span className="font-mono text-xs">
              {key.substring(0, 8)}...{key.substring(key.length - 4)}
            </span>
            <div className="flex gap-2">
              <Button
                className="text-xs"
                onClick={() => onSelectApiKey(key)}
              >
                선택
              </Button>
              <Button
                className="text-xs bg-red-500 hover:bg-red-600"
                onClick={() => onDeleteApiKey(key)}
              >
                삭제
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 