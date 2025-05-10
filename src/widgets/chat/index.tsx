import { ChatView } from './ui/ChatView';
import { useChat } from './hooks/useChat';

export const Chat = () => {
  const chatProps = useChat();
  return <ChatView {...chatProps} />;
}; 