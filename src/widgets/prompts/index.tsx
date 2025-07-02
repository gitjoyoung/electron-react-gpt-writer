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
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center shadow-sm">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">등록된 프롬프트가 없습니다</p>
        <Button 
          onClick={() => setShowForm(true)}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
        >
          첫 번째 프롬프트 추가하기
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900">프롬프트</h3>
          <p className="text-sm text-purple-600">AI와 대화할 프롬프트를 관리하세요</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
        >
          {showForm ? "목록 보기" : "프롬프트 추가"}
        </Button>
      </div>

      <div className="p-6 space-y-6">
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