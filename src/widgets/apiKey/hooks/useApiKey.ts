import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../../shared/store/useStore';
import { MESSAGES, showMessage } from '../constants/messages';

export const useApiKey = () => {
  const { apiKey, setApiKey } = useStore();
  const [showInput, setShowInput] = useState(!apiKey);
  const [savedApiKeys, setSavedApiKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadApiKeys = useCallback(async () => {
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

  useEffect(() => {
    loadApiKeys();
  }, [loadApiKeys]);

  useEffect(() => {
    setShowInput(!apiKey);
  }, [apiKey]);

  const validateApiKey = useCallback((key: string) => {
    if (!key) {
      showMessage('warning', MESSAGES.EMPTY_API_KEY.title, MESSAGES.EMPTY_API_KEY.message);
      return false;
    }

    if (!key.startsWith('sk-') || key.length < 20) {
      showMessage('error', MESSAGES.INVALID_FORMAT.title, MESSAGES.INVALID_FORMAT.message);
      return false;
    }

    return true;
  }, []);

  const handleApiKeySubmit = useCallback(async () => {
    if (!validateApiKey(apiKey)) return;
    if (savedApiKeys.includes(apiKey)) {
      setShowInput(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await window.electronAPI.saveApiKey(apiKey);
      if (result.success) {
        await loadApiKeys();
        await showMessage('info', MESSAGES.SAVE_SUCCESS.title, MESSAGES.SAVE_SUCCESS.message);
        setShowInput(false);
      } else {
        const errorMessage = MESSAGES.SAVE_ERROR_WITH_DETAILS(result.error);
        await showMessage('error', errorMessage.title, errorMessage.message);
      }
    } catch (error) {
      await showMessage(
        'error',
        MESSAGES.SAVE_EXCEPTION.title,
        error instanceof Error ? error.message : MESSAGES.SAVE_EXCEPTION.message
      );
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, savedApiKeys, validateApiKey, loadApiKeys]);

  const handleSelectApiKey = useCallback((key: string) => {
    setApiKey(key);
    setShowInput(false);
  }, [setApiKey]);

  const handleDeleteApiKey = useCallback(async (keyToDelete: string) => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.removeApiKey(keyToDelete);
      if (result.success) {
        await loadApiKeys();
      }
    } catch (error) {
      await showMessage(
        'error',
        '키 삭제 오류',
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [loadApiKeys]);

  const handleApiKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  }, [setApiKey]);

  const handleOpenApiKeyPage = useCallback(async () => {
    await window.electronAPI.openExternal("https://platform.openai.com/api-keys");
  }, []);

  return {
    apiKey,
    showInput,
    savedApiKeys,
    isLoading,
    setShowInput,
    handleApiKeySubmit,
    handleSelectApiKey,
    handleDeleteApiKey,
    handleApiKeyChange,
    handleOpenApiKeyPage
  };
}; 