import { useState } from "react";

interface UsePromptFormReturn {
  showPrompts: boolean;
  setShowPrompts: (show: boolean) => void;
  showNewPromptForm: boolean;
  setShowNewPromptForm: (show: boolean) => void;
  newPromptName: string;
  setNewPromptName: (name: string) => void;
  newPromptContent: string;
  setNewPromptContent: (content: string) => void;
  resetForm: () => void;
}

export const usePromptForm = (): UsePromptFormReturn => {
  const [showPrompts, setShowPrompts] = useState(false);
  const [showNewPromptForm, setShowNewPromptForm] = useState(false);
  const [newPromptName, setNewPromptName] = useState("");
  const [newPromptContent, setNewPromptContent] = useState("");

  const resetForm = () => {
    setNewPromptName("");
    setNewPromptContent("");
    setShowNewPromptForm(false);
  };

  return {
    showPrompts,
    setShowPrompts,
    showNewPromptForm,
    setShowNewPromptForm,
    newPromptName,
    setNewPromptName,
    newPromptContent,
    setNewPromptContent,
    resetForm
  };
}; 