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
    <div className="border-t border-gray-200 pt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">저장된 API 키</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {savedApiKeys.map((key) => (
          <div key={key} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="font-mono text-sm text-gray-600 flex-1 mr-2 truncate">
              {key.substring(0, 8)}...{key.substring(key.length - 4)}
            </span>
            <div className="flex gap-1.5">
              <Button
                onClick={() => onSelectApiKey(key)}
                size="sm"
                className="px-2 py-1 text-xs"
              >
                선택
              </Button>
              <Button
                onClick={() => onDeleteApiKey(key)}
                variant="danger"
                size="sm"
                className="px-2 py-1 text-xs"
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