import React from 'react';
import { Button } from '../../shared/ui/Button';
import { PromptForm } from './ui/PromptForm';
import { PromptList } from './ui/PromptList';
import { usePrompts } from './hooks/usePrompts';

export const Prompts = () => {
  const {
    promptTemplates,
    selectedPrompt,
    showForm,
    setShowForm,
    handleNewPrompt,
    togglePromptSelection,
    removePrompt
  } = usePrompts();

  if (promptTemplates.length === 0 && !showForm) {
    return (
      <div className="p-3 bg-gray-50 rounded text-center">
        <p className="mb-2 text-gray-600">등록된 프롬프트가 없습니다.</p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          프롬프트 추가하기
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 shadow-md bg-white rounded">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">프롬프트</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="text-xs"
        >
          {showForm ? "간단히 보기" : "프롬프트 추가"}
        </Button>
      </div>

      <div className="space-y-4">
        {showForm && (
          <div>
            <PromptForm
              onSubmit={handleNewPrompt}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <PromptList
          prompts={promptTemplates}
          selectedPrompt={selectedPrompt}
          onSelect={togglePromptSelection}
          onDelete={removePrompt}
          showForm={showForm}
        />
      </div>
    </div>
  );
}; 