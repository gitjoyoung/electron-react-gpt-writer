import { useState } from 'react';
import { Button } from '../../../../shared/ui/Button';
import type { ExcelColumn, ExcelConfig } from '../../../../shared/types/excel';

interface ExcelConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ExcelConfig;
  onSave: (config: ExcelConfig) => void;
}

export const ExcelConfigModal = ({
  isOpen,
  onClose,
  config,
  onSave
}: ExcelConfigModalProps) => {
  const [columns, setColumns] = useState<ExcelColumn[]>(config.columns);
  const [isEnabled, setIsEnabled] = useState(config.isEnabled);

  const handleAddColumn = () => {
    const newColumn: ExcelColumn = {
      id: `col_${Date.now()}`,
      name: '',
      key: '',
    };
    setColumns([...columns, newColumn]);
  };

  const handleRemoveColumn = (id: string) => {
    setColumns(columns.filter(col => col.id !== id));
  };

  const handleColumnChange = (id: string, field: keyof ExcelColumn, value: string) => {
    setColumns(columns.map(col => 
      col.id === id ? { ...col, [field]: value } : col
    ));
  };

  const handleSave = () => {
    onSave({ columns, isEnabled });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-[1200px] w-fit">
        <h2 className="text-xl font-bold mb-4">엑셀 내보내기 설정</h2>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="mr-2"
            />
            <span>GPT 응답을 컬럼 형식에 맞춰 구조화</span>
          </label>
        </div>

        <div className="space-y-4">
          {columns.map((column) => (
            <div key={column.id} className="flex gap-4 items-start">
              <input
                type="text"
                value={column.key}
                onChange={(e) => handleColumnChange(column.id, 'key', e.target.value)}
                placeholder="영문 키 (예: userName)"
                className="w-[250px] p-2 border rounded"
              />
              <input
                type="text"
                value={column.name}
                onChange={(e) => handleColumnChange(column.id, 'name', e.target.value)}
                placeholder="한글명 (예: 사용자 이름)"
                className="w-[250px] p-2 border rounded"
              />
              <button
                onClick={() => handleRemoveColumn(column.id)}
                className="text-red-500 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          <Button variant="secondary" onClick={handleAddColumn}>
            컬럼 추가
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 