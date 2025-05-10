import type { MessageBoxOptions, MessageBoxReturnValue } from './electron'

export const showNotification = (title: string, body: string, type: 'success' | 'error' | 'info') => {
  try {
    window.electronAPI.showNotification(title, body, type)
  } catch (error) {
    console.error('알림 표시 실패:', error)
  }
}

export const showMessageBox = async (options: MessageBoxOptions) => {
  try {
    const response = await window.electronAPI.showMessageBox(options)
    return response
  } catch (error) {
    console.error('메시지 박스 표시 실패:', error)
    throw error
  }
} 