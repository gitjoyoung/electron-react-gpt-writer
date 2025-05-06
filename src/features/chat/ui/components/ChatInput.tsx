import { Button } from "../../../../shared/ui/Button";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  selectedPromptName?: string;
}

export const ChatInput = ({
  input,
  setInput,
  onSubmit,
  isLoading,
  selectedPromptName
}: ChatInputProps) => {
  return (
    <div className="flex gap-2 min-w-sm w-full text-sm">
      <input
        type="text"
        value={input}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit();
          }
        }}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
        placeholder={
          selectedPromptName
            ? `${selectedPromptName} 프롬프트 사용 중...`
            : "메시지를 입력하세요..."
        }
      />
      <Button onClick={onSubmit} disabled={isLoading}>
        전송
      </Button>
    </div>
  );
}; 