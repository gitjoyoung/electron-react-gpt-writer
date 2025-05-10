export type MessageType = 'info' | 'error' | 'warning';

export interface Message {
  title: string;
  message: string;
}

export interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  showInput: boolean;
  setShowInput: (show: boolean) => void;
  savedApiKeys: string[];
  onApiKeySubmit: () => Promise<void>;
  onSelectApiKey: (key: string) => void;
  onDeleteApiKey: (key: string) => Promise<void>;
  onApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SavedApiKeysProps {
  savedApiKeys: string[];
  onSelectApiKey: (key: string) => void;
  onDeleteApiKey: (key: string) => Promise<void>;
} 