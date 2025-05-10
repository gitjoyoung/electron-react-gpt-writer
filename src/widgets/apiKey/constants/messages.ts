import type { Message, MessageType } from '../types';

export const MESSAGES = {
  EMPTY_API_KEY: {
    title: 'API 키 오류',
    message: 'API 키를 입력해주세요.'
  },
  INVALID_FORMAT: {
    title: 'API 키 형식 오류',
    message: '올바른 OpenAI API 키 형식이 아닙니다. API 키는 "sk-"로 시작해야 하고 20자 이상이어야 합니다.'
  },
  SAVE_SUCCESS: {
    title: 'API 키 저장 성공',
    message: 'API 키가 성공적으로 저장되었습니다.'
  },
  SAVE_ERROR: {
    title: 'API 키 저장 실패',
    message: '알 수 없는 오류가 발생했습니다.'
  },
  SAVE_ERROR_WITH_DETAILS: (error: string | undefined): Message => ({
    title: 'API 키 저장 실패',
    message: error || '알 수 없는 오류가 발생했습니다.'
  }),
  SAVE_EXCEPTION: {
    title: 'API 키 저장 오류',
    message: '알 수 없는 오류가 발생했습니다.'
  }
} as const;

export const showMessage = async (type: MessageType, title: string, message: string) => {
  await window.electronAPI.showMessageBox({
    type,
    title,
    message
  });
}; 