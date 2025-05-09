import { Button } from "../../shared/ui/Button";

interface SavedApiKeysProps {
  savedApiKeys: string[];
  onSelectApiKey: (key: string) => void;
  onDeleteApiKey: (key: string) => void;
}

export function SavedApiKeys({
  savedApiKeys,
  onSelectApiKey,
  onDeleteApiKey,
}: SavedApiKeysProps) {
  if (savedApiKeys.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">Key List</h3>
      <div className="space-y-2">
        {savedApiKeys.map((key, index) => (
          <div
            key={index}
            className="flex justify-between items-center flex-wrap w-full bg-gray-50 p-2 rounded text-xs"
          >
            <span className="text-sm font-bold">{index + 1}</span>
            <span className="font-mono  break-all  w-[70%]">{key}</span>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onSelectApiKey(key)}
                className="text-white bg-blue-500 p-1 hover:text-blue-700 rounded "
              >
                선택
              </button>
              <button
                onClick={() => onDeleteApiKey(key)}
                className="text-white bg-red-500 p-1 hover:text-red-700 rounded "
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
