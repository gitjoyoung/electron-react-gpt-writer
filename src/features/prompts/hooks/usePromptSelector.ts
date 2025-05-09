import { usePrompts } from "../../../shared/hooks/usePrompts";

export const usePromptSelector = () => {
  const { promptTemplates, selectedPrompt, togglePromptSelection } = usePrompts();

  return {
    promptTemplates,
    selectedPrompt,
    togglePromptSelection
  };
}; 