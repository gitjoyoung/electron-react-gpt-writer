import type { ExcelConfig, ExcelColumn } from '../../../shared/types/excel';
import type { ChatHistory } from '../../../shared/api/electron';

export interface ExcelState {
  config: ExcelConfig;
  showConfig: boolean;
}

export interface ExcelActions {
  setConfig: (config: ExcelConfig) => void;
  toggleConfigModal: () => void;
  exportToExcel: (chatHistory: ChatHistory[]) => Promise<void>;
}

export class ExcelModel {
  private state: ExcelState;

  constructor(initialConfig: ExcelConfig) {
    this.state = {
      config: initialConfig,
      showConfig: false
    };
  }

  private setState(newState: Partial<ExcelState>) {
    this.state = { ...this.state, ...newState };
  }

  getState(): ExcelState {
    return this.state;
  }

  setConfig(config: ExcelConfig) {
    this.setState({ config });
  }

  toggleConfigModal() {
    this.setState({ showConfig: !this.state.showConfig });
  }

  parseResponse(response: string): Record<string, string> {
    const result: Record<string, string> = {};
    if (!this.state.config.isEnabled) return result;

    try {
      const lines = response.split('\n');
      this.state.config.columns.forEach(col => {
        const line = lines.find(l => l.startsWith(`${col.name}:`));
        if (line) {
          const value = line.split(':')[1]?.trim();
          result[col.key] = value;
        }
      });
    } catch (error) {
      console.error('Response parsing failed:', error);
    }

    return result;
  }

  async exportToExcel(chatHistory: ChatHistory[]) {
    try {
      const result = await window.electronAPI.exportChatHistory(chatHistory);
      if (result.success) {
        alert('채팅 기록이 성공적으로 저장되었습니다!');
      } else {
        window.alert('저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      window.alert('저장 중 오류가 발생했습니다.');
    }
  }
} 