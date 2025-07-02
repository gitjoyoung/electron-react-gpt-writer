import { ipcMain, dialog, shell, Notification } from 'electron'
import path from 'path'
import { VITE_PUBLIC } from '../config/paths'

/**
 * 알림 핸들러
 */
const showNotificationHandler = (_: any, title: string, body: string, type: 'success' | 'error' | 'info') => {
  try {
    new Notification({
      title,
      body,
      icon: type === 'error'
        ? path.join(VITE_PUBLIC, 'error.png')
        : type === 'success'
          ? path.join(VITE_PUBLIC, 'success.png')
          : path.join(VITE_PUBLIC, 'info.png')
    }).show()
    return { success: true }
  } catch (error) {
    console.error('알림 표시 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

/**
 * 메시지 박스 핸들러
 */
const showMessageBoxHandler = async (_: any, options: any) => {
  try {
    // win이 없을 경우를 대비한 안전한 처리
    const { BrowserWindow } = await import('electron')
    const windows = BrowserWindow.getAllWindows()
    const mainWindow = windows.length > 0 ? windows[0] : null
    
    const result = await dialog.showMessageBox(mainWindow!, options)
    return result  // 직접 반환하여 result.response로 접근 가능하도록 수정
  } catch (error) {
    console.error('메시지 박스 표시 실패:', error)
    throw error  // 에러를 throw하여 클라이언트에서 catch할 수 있도록 수정
  }
}

/**
 * 에러 박스 핸들러
 */
const showErrorBoxHandler = (_: any, title: string, content: string) => {
  try {
    dialog.showErrorBox(title, content)
    return { success: true }
  } catch (error) {
    console.error('에러 박스 표시 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

/**
 * 외부 링크 열기 핸들러
 */
const openExternalHandler = async (_: any, url: string) => {
  try {
    await shell.openExternal(url)
    return { success: true }
  } catch (error) {
    console.error('외부 링크 열기 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

/**
 * UI 관련 IPC 핸들러 등록
 */
export const registerUIHandlers = () => {
  ipcMain.handle('show-notification', showNotificationHandler)
  ipcMain.handle('showMessageBox', showMessageBoxHandler)  // preload와 일치하도록 수정
  ipcMain.handle('show-error-box', showErrorBoxHandler)
  ipcMain.handle('open-external', openExternalHandler)
  
  console.log('UI 핸들러가 등록되었습니다.')
} 