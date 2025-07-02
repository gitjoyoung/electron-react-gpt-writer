import { registerApiKeyHandlers } from './apiKeyHandlers'
import { registerPromptHandlers } from './promptHandlers'
import { registerChatHandlers } from './chatHandlers'
import { registerExportHandlers } from './exportHandlers'
import { registerUIHandlers } from './uiHandlers'
import { registerUpdateHandlers } from './updateHandlers'

/**
 * 모든 IPC 핸들러를 등록하는 함수
 */
export const registerAllHandlers = () => {
  console.log('IPC 핸들러 등록을 시작합니다...')
  
  // 각 모듈별 핸들러 등록
  registerApiKeyHandlers()
  registerPromptHandlers()
  registerChatHandlers()
  registerExportHandlers()
  registerUIHandlers()
  registerUpdateHandlers()
  
  console.log('모든 IPC 핸들러가 성공적으로 등록되었습니다.')
}

/**
 * 핸들러 정리 (앱 종료 시 호출)
 */
export const cleanupHandlers = () => {
  console.log('IPC 핸들러를 정리합니다...')
  // 필요시 여기에 정리 로직 추가
} 