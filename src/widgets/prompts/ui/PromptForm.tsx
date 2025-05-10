import React from 'react';
import { Button } from '../../../shared/ui/Button';
import { PropertyManager } from './PropertyManager';
import type { PromptFormProps } from '../types';

export const PromptForm: React.FC<PromptFormProps> = ({
  onSubmit,
  onCancel,
  initialValues
}) => {
  const [formState, setFormState] = React.useState({
    name: initialValues?.name || '',
    content: initialValues?.content || '',
    responseFormat: initialValues?.responseFormat || 'json',
    columns: initialValues?.columns || [],
    columnInput: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formState.name.trim()) {
      alert('프롬프트 이름을 입력해주세요.');
      return;
    }
    if (!formState.content.trim()) {
      alert('프롬프트 내용을 입력해주세요.');
      return;
    }

    // 프롬프트 추가
    await onSubmit(
      formState.name,
      formState.content,
      formState.responseFormat,
      formState.columns
    );

    // 폼 초기화
    setFormState(prev => ({
      ...prev,
      name: '',
      content: '',
      columns: []
    }));
  };

  const handleAddColumn = () => {
    if (!formState.columnInput.trim()) return;
    
    // 이미 존재하는 속성인지 확인
    if (formState.columns.includes(formState.columnInput.trim())) {
      alert('이미 존재하는 속성입니다.');
      return;
    }

    // 속성 즉시 추가
    setFormState(prev => ({
      ...prev,
      columns: [...prev.columns, formState.columnInput.trim()],
      columnInput: ''
    }));
  };

  const handleRemoveColumn = (index: number) => {
    setFormState(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="mb-4 p-3 text-xs bg-white rounded shadow">
      <div className="space-y-4">
        {/* 속성 관리 섹션 */}
        <div>
          <PropertyManager
            columns={formState.columns}
            isEdit={false}
            columnInput={formState.columnInput}
            setColumnInput={(value) => setFormState(prev => ({ ...prev, columnInput: value }))}
            handleAddColumn={handleAddColumn}
            handleRemoveColumn={handleRemoveColumn}
            setColumns={(columns) => setFormState(prev => ({ ...prev, columns }))}
          />
        </div>

        {/* 프롬프트 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              프롬프트 이름
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
              placeholder="프롬프트 이름을 입력하세요"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              프롬프트 내용
            </label>
            <textarea
              value={formState.content}
              onChange={(e) => setFormState(prev => ({ ...prev, content: e.target.value }))}
              placeholder="프롬프트 내용을 입력하세요"
              className="w-full p-2 border rounded"
              rows={15}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              반환 형식
            </label>
            <select
              value={formState.responseFormat}
              onChange={(e) => setFormState(prev => ({ ...prev, responseFormat: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="json">JSON</option>
            </select>
          </div>

          <div className="flex justify-center gap-2">
            <Button type="submit">프롬프트 추가</Button>
            {onCancel && (
              <Button type="button" variant="danger" onClick={onCancel}>
                취소
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}; 