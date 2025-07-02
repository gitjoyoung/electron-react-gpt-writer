import { app } from 'electron'
import path from 'path'
import { fileURLToPath } from 'node:url'

// ES 모듈에서 __dirname 대체
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 앱 루트 경로
 * 빌드된 환경: dist-electron/main → ../../ → 프로젝트 루트
 * 개발 환경: electron/main → ../../ → 프로젝트 루트
 */
export const APP_ROOT = path.join(__dirname, '../..')

/**
 * API 키 파일 경로
 */
export const getApiKeysFilePath = () => {
  return process.env.NODE_ENV === 'development' 
    ? path.join(APP_ROOT, 'api-keys.json')
    : path.join(app.getPath('userData'), 'api-keys.json')
}

/**
 * 프롬프트 파일 경로
 */
export const getPromptsFilePath = () => {
  return process.env.NODE_ENV === 'development'
    ? path.join(APP_ROOT, 'prompts.json')
    : path.join(app.getPath('userData'), 'prompts.json')
}

/**
 * 채팅 내역 파일 경로
 */
export const getChatHistoryPath = () => {
  return path.join(APP_ROOT, 'chat-history.json')
}

/**
 * 자동화 내역 파일 경로
 */
export const getAutomationHistoryPath = () => {
  return path.join(APP_ROOT, 'automation-history.json')
}

/**
 * 개발/프로덕션 환경별 디렉토리 경로들
 */
export const MAIN_DIST = path.join(APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

export const VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(APP_ROOT, 'public')
  : RENDERER_DIST 