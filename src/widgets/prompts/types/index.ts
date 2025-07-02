import type { PromptTemplate } from '../../../shared/api/electron';

export interface PropertyManagerProps {
  columns: string[];
  isEdit: boolean;
  columnInput: string;
  setColumnInput: (value: string) => void;
  handleAddColumn: (isEdit?: boolean) => Promise<void>;
  handleRemoveColumn: (index: number, isEdit?: boolean) => void;
  setColumns: (columns: string[]) => void;
}

export interface PromptFormProps {
  onSubmit: (name: string, content: string, responseFormat: string, columns: string[]) => Promise<void>;
  onCancel?: () => void;
  initialValues?: {
    name: string;
    content: string;
    responseFormat: string;
    columns: string[];
  };
}

export interface PromptListProps {
  prompts: PromptTemplate[];
  selectedPrompt: PromptTemplate | null;
  onSelect: (prompt: PromptTemplate) => void;
  onDelete: (id: string) => void;
}

export interface PromptDetailProps {
  prompt: PromptTemplate;
  isEditing: boolean;
  onEdit: (prompt: PromptTemplate) => void;
  onSave: (id: string, name: string, content: string, responseFormat: string, columns: string[]) => Promise<void>;
  onCancel: () => void;
  onDelete: (id: string) => void;
} 