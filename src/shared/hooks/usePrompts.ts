import { useState, useEffect, useCallback } from 'react';
import { PromptTemplate } from '../api/electron';

// 프롬프트 파일 이름
const PROMPTS_FILE = 'prompts.json';

export const usePrompts = () => {
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null);

  const loadSavedPrompts = useCallback(async () => {
    try {
      const result = await window.electronAPI.loadPrompts();
      if (result.success && result.prompts) {
        // 최신순으로 정렬
        const sortedPrompts = result.prompts.sort((a, b) => b.updatedAt - a.updatedAt);
        setPromptTemplates(sortedPrompts);
      } else {
        console.error("프롬프트 불러오기 실패:", result.error);
      }
    } catch (error) {
      console.error("프롬프트 불러오기 오류:", error);
    }
  }, []);

  const savePrompts = useCallback(async (prompts: PromptTemplate[]) => {
    try {
      const result = await window.electronAPI.savePrompts(prompts);
      if (!result.success) {
        console.error("프롬프트 저장 실패:", result.error);
      }
    } catch (error) {
      console.error("프롬프트 저장 오류:", error);
    }
  }, []);

  const addPrompt = useCallback(async (name: string, content: string, responseFormat: string, columns: string[]) => {
    if (!name.trim() || !content.trim()) {
      throw new Error('프롬프트 이름과 내용은 필수입니다.');
    }
    
    const newPrompt: PromptTemplate = {
      id: Date.now().toString(),
      name,
      content,
      responseFormat,
      columns,
      updatedAt: Date.now()
    };
    
    try {
      const updatedPrompts = [newPrompt, ...promptTemplates];
      const result = await window.electronAPI.savePrompts(updatedPrompts);
      
      if (!result.success) {
        throw new Error(result.error || '프롬프트 저장에 실패했습니다.');
      }
      
      setPromptTemplates(updatedPrompts);
      return newPrompt;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      throw new Error(`프롬프트 저장 실패: ${errorMessage}`);
    }
  }, [promptTemplates]);

  const updatePrompt = useCallback(async (id: string, name: string, content: string, responseFormat: string, columns: string[]) => {
    if (!name.trim() || !content.trim()) {
      throw new Error('프롬프트 이름과 내용은 필수입니다.');
    }

    try {
      const updatedPrompt = {
        id,
        name,
        content,
        responseFormat,
        columns,
        updatedAt: Date.now()
      };

      const result = await window.electronAPI.updatePromptTemplate(updatedPrompt);
      
      if (result.success && result.prompts) {
        const updatedPrompts = result.prompts;
        setPromptTemplates(updatedPrompts);
        
        if (selectedPrompt?.id === id) {
          const updated = updatedPrompts.find(p => p.id === id);
          if (updated) {
            setSelectedPrompt(updated);
          }
        }
      } else {
        throw new Error(result.error || '프롬프트 수정에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      throw new Error(`프롬프트 수정 실패: ${errorMessage}`);
    }
  }, [promptTemplates, selectedPrompt]);

  const removePrompt = useCallback(async (id: string) => {
    const confirmDelete = window.confirm('정말로 이 프롬프트를 삭제하시겠습니까?');
    if (!confirmDelete) return;

    const updatedPrompts = promptTemplates.filter(p => p.id !== id);
    setPromptTemplates(updatedPrompts);
    await savePrompts(updatedPrompts);
    
    if (selectedPrompt?.id === id) {
      setSelectedPrompt(null);
    }
  }, [promptTemplates, selectedPrompt, savePrompts]);

  const togglePromptSelection = useCallback((prompt: PromptTemplate) => {
    setSelectedPrompt(current => 
      current?.id === prompt.id ? null : prompt
    );
  }, []);

  useEffect(() => {
    loadSavedPrompts();
  }, [loadSavedPrompts]);

  return {
    promptTemplates,
    selectedPrompt,
    addPrompt,
    removePrompt,
    togglePromptSelection,
    updatePrompt
  };
}; 