import type { PromptTemplate } from "../../../shared/api/electron";

export interface PromptSelectorProps {
  promptTemplates: PromptTemplate[];
  selectedPrompt: PromptTemplate | null;
  togglePromptSelection: (prompt: PromptTemplate) => void;
  addPrompt: (
    name: string,
    content: string,
    responseFormat: string,
    columns: string[]
  ) => Promise<PromptTemplate | undefined>;
  removePrompt: (id: string) => void;
  updatePrompt: (
    id: string,
    name: string,
    content: string,
    responseFormat: string,
    columns: string[]
  ) => Promise<void>;
}

export interface PropertyManagerProps {
  columns: string[];
  isEdit: boolean;
  columnInput: string;
  setColumnInput: (value: string) => void;
  handleAddColumn: (isEdit: boolean) => void;
  handleRemoveColumn: (index: number, isEdit: boolean) => void;
  setColumns: (columns: string[]) => void;
}

export interface SortableItemProps {
  id: string;
  column: string;
  index: number;
  isEdit: boolean;
  onRemove: () => void;
} 