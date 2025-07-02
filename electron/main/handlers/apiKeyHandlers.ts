import { ipcMain } from 'electron'
import { readFile, writeFile } from 'node:fs/promises'
import { getApiKeysFilePath } from '../config/paths'

/**
 * API 키 저장 핸들러
 */
const saveApiKeyHandler = async (_: any, apiKey: string) => {
  try {
    let keys: string[] = []
    try {
      const data = await readFile(getApiKeysFilePath(), 'utf-8')
      keys = JSON.parse(data)
    } catch (error) {
      // 파일이 없거나 읽기 실패시 빈 배열 사용
      keys = []
    }

    if (!keys.includes(apiKey)) {
      keys.push(apiKey)
      await writeFile(getApiKeysFilePath(), JSON.stringify(keys, null, 2))
    }
    return { success: true }
  } catch (error) {
    console.error('API 키 저장 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

/**
 * API 키 목록 불러오기 핸들러
 */
const loadApiKeysHandler = async () => {
  try {
    const data = await readFile(getApiKeysFilePath(), 'utf-8')
    return { success: true, keys: JSON.parse(data) }
  } catch (error) {
    // 파일이 없는 경우 빈 배열 반환
    if (error instanceof Error && ('code' in error) && error.code === 'ENOENT') {
      return { success: true, keys: [] }
    }
    console.error('API 키 불러오기 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

/**
 * API 키 삭제 핸들러
 */
const removeApiKeyHandler = async (_: any, apiKey: string) => {
  try {
    const data = await readFile(getApiKeysFilePath(), 'utf-8')
    let keys = JSON.parse(data)
    keys = keys.filter((key: string) => key !== apiKey)
    await writeFile(getApiKeysFilePath(), JSON.stringify(keys, null, 2))
    return { success: true }
  } catch (error) {
    console.error('API 키 삭제 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

/**
 * API 키 관련 IPC 핸들러 등록
 */
export const registerApiKeyHandlers = () => {
  ipcMain.handle('save-api-key', saveApiKeyHandler)
  ipcMain.handle('load-api-keys', loadApiKeysHandler)
  ipcMain.handle('remove-api-key', removeApiKeyHandler)
  
  console.log('API 키 핸들러가 등록되었습니다.')
} 