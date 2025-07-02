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
    <div className="w-full">
      {showInput ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">OpenAI API 키</h1>
              <p className="text-sm text-gray-500">AI 채팅을 시작하기 위해 API 키를 입력해주세요</p>
            </div>
            <button
              onClick={handleOpenApiKeyPage}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              API 키 확인하기
            </button>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={apiKey}
              onChange={handleApiKeyChange}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono placeholder-gray-400 transition-all"
              placeholder="sk-proj-..."
              disabled={isLoading}
            />
            <Button 
              onClick={handleApiKeySubmit}
              disabled={isLoading || !apiKey.trim()}
              className="px-6 py-2.5"
            >
              {isLoading ? '확인 중...' : '확인'}
            </Button>
          </div>

          {savedApiKeys.length > 0 && (
            <SavedApiKeys
              savedApiKeys={savedApiKeys}
              onSelectApiKey={handleSelectApiKey}
              onDeleteApiKey={handleDeleteApiKey}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h1 className="text-xl font-semibold text-gray-900">GPT 프롬프트 관리자</h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg">
              <span className="text-sm font-medium">API 키 연결됨</span>
              <span className="font-mono text-sm">
                {apiKey.substring(0, 8)}...{apiKey.substring(apiKey.length - 4)}
              </span>
            </div>
          </div>
          <Button 
            onClick={() => setShowInput(true)}
            disabled={isLoading}
            variant="secondary"
            size="sm"
          >
            API 키 변경
          </Button>
        </div>
      )}
    </div>
  );
}; 