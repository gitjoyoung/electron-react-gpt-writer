export interface ChatHistory {
  query: string;
  response: string;
  timestamp: string;
  [key: string]: any; // 동적 필드를 위한 인덱스 시그니처
} 