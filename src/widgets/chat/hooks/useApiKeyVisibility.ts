import { useState } from "react";

export const useApiKeyVisibility = () => {
  const [showApiKeys, setShowApiKeys] = useState(false);

  return {
    showApiKeys,
    setShowApiKeys
  };
}; 