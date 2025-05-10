import { Button } from '../../shared/ui/Button';
import { SavedApiKeys } from './ui/SavedApiKeys';
import { useApiKey } from './hooks/useApiKey';

export const ApiKeyInput = () => {
  const {
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
  } = useApiKey();

  return (
    <div className="min-w-md mx-auto p-2 bg-white rounded-lg shadow-md">
      {showInput ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">OpenAI API key</h2>
            <button
              onClick={handleOpenApiKeyPage}
              className="text-blue-500 hover:text-blue-700 text-xs"
            >
              API 키 확인하기
            </button>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={apiKey}
              onChange={handleApiKeyChange}
              className="border-black flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-xs overflow-x-scroll whitespace-pre-wrap text-ellipsis"
              placeholder="sk-..."
              disabled={isLoading}
            />
            <Button 
              className="text-xs" 
              onClick={handleApiKeySubmit}
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '확인'}
            </Button>
          </div>

          <SavedApiKeys
            savedApiKeys={savedApiKeys}
            onSelectApiKey={handleSelectApiKey}
            onDeleteApiKey={handleDeleteApiKey}
          />
        </>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold">선택된 API 키 :</span>
          <span className="font-mono text-xs bg-gray-50 p-2 rounded flex-1">
            {apiKey.substring(0, 8)}...{apiKey.substring(apiKey.length - 4)}
          </span>
          <Button 
            className="text-xs" 
            onClick={() => setShowInput(true)}
            disabled={isLoading}
          >
            다른 API 키 입력
          </Button>
        </div>
      )}
    </div>
  );
}; 