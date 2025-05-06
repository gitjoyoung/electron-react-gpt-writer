import type { ChatHistory, PromptTemplate } from '../../../shared/api/electron';

export interface ChatState {
  input: string;
  response: string | null;
  isLoading: boolean;
  chatHistory: ChatHistory[];
}

export class ChatModel {
  private state: ChatState = {
    input: '',
    response: null,
    isLoading: false,
    chatHistory: []
  };

  private setState(newState: Partial<ChatState>) {
    this.state = { ...this.state, ...newState };
  }

  getState(): ChatState {
    return this.state;
  }

  setInput(input: string) {
    this.setState({ input });
  }

  async submitChat(input: string, selectedPrompt: PromptTemplate | null) {
    this.setState({ isLoading: true });
    try {
      // API 호출 로직은 나중에 구현
      this.setState({ response: "테스트 응답" });
    } catch (error) {
      console.error('Chat submission failed:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }
} 