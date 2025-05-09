import { useState } from 'react';
import type { PromptTemplate } from '../../../shared/api/electron';

interface UseChatProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const useChat = ({ apiKey, onApiKeyChange }: UseChatProps) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    userInput: string,
    selectedPrompt: PromptTemplate | null
  ) => {
    if (!apiKey) {
      alert('API 키를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      let finalPrompt = userInput;

      if (selectedPrompt) {
        if (selectedPrompt.responseFormat === 'json') {
          const templateContent = selectedPrompt.content.replace('{주제}', userInput);
          
          finalPrompt = `${templateContent}

당신의 응답은 반드시 다음 형식이어야 합니다:
응답 형식: ${selectedPrompt.responseFormat}
필수 포함 속성: ${selectedPrompt.columns.join(', ')}

다음과 같은 JSON 형식으로만 응답해주세요:
{
  ${selectedPrompt.columns.map(col => `"${col}": "이 속성에 적절한 값을 채워주세요"`).join(',\n  ')}
}

다른 설명이나 부가적인 텍스트 없이 오직 JSON 형식으로만 응답해주세요.`;
        } else {
          finalPrompt = `${selectedPrompt.content}\n\n${userInput}`;
        }
      }

      console.log("selectedPrompt", selectedPrompt);
      console.log("finalPrompt", finalPrompt);

      const response = await window.electronAPI.chatGPT(finalPrompt, apiKey);
      if (response.success) {
        setResponse(response.message || '');
      } else {
        alert('오류가 발생했습니다: ' + response.error);
        if (response.error === 'Invalid API key') {
          onApiKeyChange('');
        }
      }
    } catch (error) {
      console.error('GPT 요청 실패:', error);
      alert('요청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    input,
    setInput,
    response,
    isLoading,
    handleSubmit,
  };
}; 