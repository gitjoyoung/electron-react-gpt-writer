import { useState, useCallback, useEffect } from 'react';
import { useStore } from '../../../shared/store/useStore';
import type { PromptTemplate } from '../../../shared/api/electron';

export const usePrompts = () => {
  // 필요한 상태만 선택적으로 구독
  const selectedPrompt = useStore(state => state.selectedPrompt);
  const togglePromptSelection = useStore(state => state.togglePromptSelection);
  const addPrompt = useStore(state => state.addPrompt);
  const removePrompt = useStore(state => state.removePrompt);

  const [showForm, setShowForm] = useState(false);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 프롬프트 목록 로드
  const loadPrompts = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await window.electronAPI.loadPrompts();
      if (result.success && result.prompts) {
        setPromptTemplates(result.prompts);
      }
    } catch (error) {
      console.error("프롬프트 로드 실패:", error);
      await window.electronAPI.showMessageBox({
        type: "error",
        title: "로드 실패",
        message: "프롬프트 목록을 불러오는데 실패했습니다."
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const handleNewPrompt = useCallback(async (name: string, content: string, responseFormat: string, columns: string[]) => {
    if (!name.trim() || !content.trim()) {
      await window.electronAPI.showMessageBox({
        type: "warning",
        title: "입력 확인",
        message: "프롬프트 이름과 내용을 입력해주세요.",
      });
      return;
    }

    try {
      const result = await addPrompt(
        name,
        content,
        responseFormat,
        columns
      );

      if (result) {
        await window.electronAPI.showMessageBox({
          type: "info",
          title: "저장 완료",
          message: "프롬프트가 성공적으로 저장되었습니다.",
        });
        // 프롬프트 목록 새로고침
        await loadPrompts();
      }
    } catch (error) {
      console.error("프롬프트 추가 실패:", error);
      await window.electronAPI.showMessageBox({
        type: "error",
        title: "저장 실패",
        message: error instanceof Error ? error.message : "프롬프트 저장에 실패했습니다."
      });
    }
  }, [addPrompt, loadPrompts]);

  const handleRemovePrompt = useCallback(async (id: string) => {
    try {
      await removePrompt(id);
      // 프롬프트 목록 새로고침
      await loadPrompts();
    } catch (error) {
      console.error("프롬프트 삭제 실패:", error);
      await window.electronAPI.showMessageBox({
        type: "error",
        title: "삭제 실패",
        message: error instanceof Error ? error.message : "프롬프트 삭제에 실패했습니다."
      });
    }
  }, [removePrompt, loadPrompts]);

  return {
    promptTemplates,
    selectedPrompt,
    showForm,
    setShowForm,
    handleNewPrompt,
    togglePromptSelection,
    removePrompt: handleRemovePrompt,
    isLoading,
    refreshPrompts: loadPrompts
  };
}; 