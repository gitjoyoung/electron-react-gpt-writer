export interface ExcelColumn {
  id: string;
  name: string;
  key: string;
}

export interface ExcelConfig {
  columns: ExcelColumn[];
  isEnabled: boolean;
}

export const DEFAULT_EXCEL_COLUMNS: ExcelColumn[] = [
  {
    id: "query",
    name: "질문",
    key: "query"
  },
  {
    id: "response",
    name: "응답",
    key: "response"
  },
  {
    id: "timestamp",
    name: "시간",
    key: "timestamp"
  }
]; 