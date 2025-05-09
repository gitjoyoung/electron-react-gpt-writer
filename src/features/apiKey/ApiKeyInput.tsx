import { useState, useEffect } from "react";
import { Button } from "../../shared/ui/Button";
import { SavedApiKeys } from "./SavedApiKeys";

interface ApiKeyInputProps {
  onApiKeySelect: (key: string) => void;
}

type MessageType = 'info' | 'error' | 'warning';

const MESSAGES = {
  EMPTY_API_KEY: {
    title: 'API 키 오류',
    message: 'API 키를 입력해주세요.'
  },
  INVALID_FORMAT: {
    title: 'API 키 형식 오류',
    message: '올바른 OpenAI API 키 형식이 아닙니다. API 키는 "sk-"로 시작해야 하고 20자 이상이어야 합니다.'
  },
  SAVE_SUCCESS: {
    title: 'API 키 저장 성공',
    message: 'API 키가 성공적으로 저장되었습니다.'
  },
  SAVE_ERROR: {
    title: 'API 키 저장 실패',
    message: '알 수 없는 오류가 발생했습니다.'
  },
  SAVE_ERROR_WITH_DETAILS: (error: string | undefined) => ({
    title: 'API 키 저장 실패',
    message: error || '알 수 없는 오류가 발생했습니다.'
  }),
  SAVE_EXCEPTION: {
    title: 'API 키 저장 오류',
    message: '알 수 없는 오류가 발생했습니다.'
  }
};

const showMessage = async (type: MessageType, title: string, message: string) => {
  await (window.electronAPI as any).showMessageBox({
    type,
    title,
    message
  });
};

export function ApiKeyInput({ onApiKeySelect }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [savedApiKeys, setSavedApiKeys] = useState<string[]>([]);

  useEffect(() => {
    const loadApiKeys = async () => {
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
    };
    loadApiKeys();
  }, []);

  const handleApiKeySubmit = async () => {
    if (!apiKey) {
      await showMessage('warning', MESSAGES.EMPTY_API_KEY.title, MESSAGES.EMPTY_API_KEY.message);
      return;
    }

    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      await showMessage(
        'error',
        MESSAGES.INVALID_FORMAT.title,
        MESSAGES.INVALID_FORMAT.message
      );
      return;
    }

    if (!savedApiKeys.includes(apiKey)) {
      try {
        const result = await window.electronAPI.saveApiKey(apiKey);
        if (result.success) {
          const loadResult = await window.electronAPI.loadApiKeys();
          if (loadResult.success) {
            setSavedApiKeys(loadResult.keys);
            await showMessage(
              'info',
              MESSAGES.SAVE_SUCCESS.title,
              MESSAGES.SAVE_SUCCESS.message
            );
          }
        } else {
          const errorMessage = MESSAGES.SAVE_ERROR_WITH_DETAILS(result.error);
          await showMessage(
            'error',
            errorMessage.title,
            errorMessage.message
          );
        }
      } catch (error) {
        await showMessage(
          'error',
          MESSAGES.SAVE_EXCEPTION.title,
          error instanceof Error ? error.message : MESSAGES.SAVE_EXCEPTION.message
        );
      }
    }
    onApiKeySelect(apiKey);
    setShowInput(false);
  };

  const handleSelectApiKey = (key: string) => {
    setApiKey(key);
    onApiKeySelect(key);
    setShowInput(false);
  };

  const handleDeleteApiKey = async (keyToDelete: string) => {
    try {
      const result = await window.electronAPI.removeApiKey(keyToDelete);
      if (result.success) {
        const loadResult = await window.electronAPI.loadApiKeys();
        if (loadResult.success) {
          setSavedApiKeys(loadResult.keys);
        }
      } else {
      }
    } catch (error) {
      await showMessage(
        'error',
        '키 삭제 오류',
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      );
    }
  };

  return (
    <div className="min-w-md mx-auto p-2 bg-white rounded-lg shadow-md">
      {showInput ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">OpenAI API key</h2>
            <button
              onClick={() => {
                window.electron.openExternal(
                  "https://platform.openai.com/api-keys"
                );
              }}
              className="text-blue-500 hover:text-blue-700 text-xs"
            >
              API 키 확인하기
            </button>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="border-black flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-xs overflow-x-scroll whitespace-pre-wrap text-ellipsis
              "
              placeholder="sk-..."
            />
            <Button className="text-xs" onClick={handleApiKeySubmit}>확인</Button>
          </div>

          <SavedApiKeys
            savedApiKeys={savedApiKeys}
            onSelectApiKey={handleSelectApiKey}
            onDeleteApiKey={handleDeleteApiKey}
          />
        </>
      ) : (
        <div className="flex  items-center justify-between">
          <span className="text-xs font-bold ">선택된 API 키 :</span>
          <span className="font-mono text-xs bg-gray-50 p-2 rounded flex-1">
            {apiKey.substring(0, 8) + "..." + apiKey.substring(apiKey.length - 4)}
          </span>
          <Button className="text-xs"  onClick={() => setShowInput(true)}>다른 API 키 입력</Button>
        </div>
      )}
    </div>
  );
}
