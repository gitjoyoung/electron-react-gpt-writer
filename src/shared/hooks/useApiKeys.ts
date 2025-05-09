import { useState, useEffect, useCallback } from 'react';

export const useApiKeys = () => {
  const [savedApiKeys, setSavedApiKeys] = useState<string[]>([]);

  const loadSavedApiKeys = useCallback(async () => {
    try {
      const result = await window.electronAPI.loadApiKeys();
      if (result.success) {
        setSavedApiKeys(result.keys);
      } else {
        console.error("API 키 불러오기 실패:", result.error);
      }
    } catch (error) {
      console.error("API 키 불러오기 오류:", error);
    }
  }, []);

  const saveApiKey = useCallback(async (apiKey: string) => {
    if (!apiKey || savedApiKeys.includes(apiKey)) return;
    
    try {
      const result = await window.electronAPI.saveApiKey(apiKey);
      if (result.success) {
        await loadSavedApiKeys();
      } else {
        console.error("API 키 저장 실패:", result.error);
      }
    } catch (error) {
      console.error("API 키 저장 오류:", error);
    }
  }, [savedApiKeys, loadSavedApiKeys]);

  const removeApiKey = useCallback(async (keyToRemove: string) => {
    try {
      const result = await window.electronAPI.removeApiKey(keyToRemove);
      if (result.success) {
        await loadSavedApiKeys();
      } else {
        console.error("API 키 삭제 실패:", result.error);
      }
    } catch (error) {
      console.error("API 키 삭제 오류:", error);
    }
  }, [loadSavedApiKeys]);

  useEffect(() => {
    loadSavedApiKeys();
  }, [loadSavedApiKeys]);

  return {
    savedApiKeys,
    saveApiKey,
    removeApiKey
  };
}; 