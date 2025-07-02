import React from 'react';
import type { PropertyManagerProps } from '../types';

export const PropertyManager: React.FC<PropertyManagerProps> = ({
  columns,
  isEdit,
  columnInput,
  setColumnInput,
  handleAddColumn,
  handleRemoveColumn,
  setColumns
}) => {
  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleAddColumn(isEdit);
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-medium text-gray-700 mb-2">
        속성 목록
      </label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={columnInput}
          onChange={(e) => setColumnInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="속성 이름"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={async () => await handleAddColumn(isEdit)}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          추가
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {columns.map((column, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1"
          >
            <span className="text-sm">{column}</span>
            <button
              onClick={() => handleRemoveColumn(index, isEdit)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; 