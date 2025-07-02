import { ipcMain, dialog } from 'electron'
import XLSX from 'xlsx'
import fs from 'node:fs'

/**
 * 채팅 내역 엑셀 내보내기 핸들러
 */
const exportChatHistoryHandler = async (_: any, history: any[]) => {
  try {
    const workbook = XLSX.utils.book_new()
    
    // 데이터를 워크시트 형식으로 변환 (키를 그대로 사용)
    const worksheet = XLSX.utils.json_to_sheet(history)

    // 기본 칼럼 너비 설정
    const wscols = Object.keys(history[0] || {}).map(() => ({ wch: 25 }))
    worksheet['!cols'] = wscols

    // 워크시트를 워크북에 추가
    XLSX.utils.book_append_sheet(workbook, worksheet, '채팅 내역')

    // 저장할 파일 경로 선택
    const { filePath } = await dialog.showSaveDialog({
      title: '채팅 내역 저장',
      defaultPath: 'chat-history.xlsx',
      filters: [
        { name: 'Excel 파일', extensions: ['xlsx'] }
      ]
    })

    if (!filePath) {
      return { success: false, error: '저장이 취소되었습니다.' }
    }

    // 엑셀 파일 저장
    XLSX.writeFile(workbook, filePath)
    
    return { success: true }
  } catch (error) {
    console.error('채팅 내역 내보내기 실패:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
    }
  }
}

/**
 * 채팅 내역 JSON 내보내기 핸들러
 */
const exportChatHistoryJsonHandler = async (_: any, history: any[]) => {
  try {
    // 저장할 파일 경로 선택
    const { filePath } = await dialog.showSaveDialog({
      title: '채팅 내역 JSON 저장',
      defaultPath: 'chat-history.json',
      filters: [
        { name: 'JSON 파일', extensions: ['json'] }
      ]
    })

    if (!filePath) {
      return { success: false, error: '저장이 취소되었습니다.' }
    }

    // JSON 파일 저장
    await fs.promises.writeFile(filePath, JSON.stringify(history, null, 2))
    
    return { success: true }
  } catch (error) {
    console.error('채팅 내역 JSON 내보내기 실패:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
    }
  }
}

/**
 * 내보내기 관련 IPC 핸들러 등록
 */
export const registerExportHandlers = () => {
  ipcMain.handle('export-chat-history', exportChatHistoryHandler)
  ipcMain.handle('export-chat-history-json', exportChatHistoryJsonHandler)
  
  console.log('내보내기 핸들러가 등록되었습니다.')
} 