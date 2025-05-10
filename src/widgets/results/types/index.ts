import { ChatHistory } from '../../../shared/api/electron';

export interface ChatResponse {
  id: string;
  timestamp: string;
  prompt: string;
  response: string;
  images?: string[];
}

export interface ResultItemProps {
  response: ChatResponse;
  isSelected: boolean;
  isExpanded: boolean;
  onSelectionChange: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface ResultListProps {
  responses: ChatResponse[];
  selectedResponses: string[];
  expandedItems: Set<string>;
  onSelectionChange: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
} 