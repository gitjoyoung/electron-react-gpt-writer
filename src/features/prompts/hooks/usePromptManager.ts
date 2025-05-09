import { usePrompts } from "../../../shared/hooks/usePrompts";

export const usePromptManager = () => {
  const { promptTemplates, addPrompt, removePrompt } = usePrompts();

  return {
    promptTemplates,
    addPrompt,
    removePrompt
  };
}; 