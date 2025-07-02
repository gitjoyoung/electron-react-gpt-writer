import React from "react";
import { ChatView } from "./ui/ChatView";
import { useChat } from "./hooks/useChat";

export const Chat: React.FC = () => {
  const {
    input,
    setInput,
    isLoading,
    response,
    messages,
    onSubmit,
    saveToResults,
    startNewChat,
    selectedPromptName,
  } = useChat();

  return (
    <ChatView
      input={input}
      setInput={setInput}
      isLoading={isLoading}
      response={response}
      messages={messages}
      onSubmit={onSubmit}
      saveToResults={saveToResults}
      startNewChat={startNewChat}
      selectedPromptName={selectedPromptName}
    />
  );
}; 