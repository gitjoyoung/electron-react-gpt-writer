import { BrowserWindow, shell } from 'electron'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { RENDERER_DIST, VITE_DEV_SERVER_URL, VITE_PUBLIC } from '../config/paths'
import { setupUpdateService } from './updateService'

// ES 모듈에서 __dirname 대체
const __dirname = path.dirname(fileURLToPath(import.meta.url))

let mainWindow: BrowserWindow | null = null

const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

/**
 * 메인 윈도우 생성
 */
export const createMainWindow = async (): Promise<BrowserWindow> => {
  mainWindow = new BrowserWindow({
    title: 'GPT Prompt Manager',
    icon: path.join(VITE_PUBLIC, 'favicon.ico'),
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload,
      contextIsolation: true,
      // 한글 입력 지원
      experimentalFeatures: true,
    },
  })

  // 창 종료 이벤트 처리
  mainWindow.on('closed', () => {
    console.log('메인 창이 닫혔습니다.')
    mainWindow = null
  })

  // 창 닫기 시도 시 확인
  mainWindow.on('close', (event) => {
    console.log('창 닫기가 요청되었습니다.')
    // 필요시 여기서 저장 확인 등을 할 수 있음
  })

  // 개발/프로덕션 환경에 따른 로딩
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(indexHtml)
  }

  // 모든 링크를 브라우저에서 열기
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // 업데이트 서비스 설정
  setupUpdateService(mainWindow)

  return mainWindow
}

/**
 * 메인 윈도우 가져오기
 */
export const getMainWindow = (): BrowserWindow | null => {
  return mainWindow
}

/**
 * 윈도우 포커스
 */
export const focusMainWindow = (): void => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
}

/**
 * 모든 윈도우 닫기
 */
export const closeAllWindows = (): void => {
  const allWindows = BrowserWindow.getAllWindows()
  allWindows.forEach(window => window.close())
  mainWindow = null
}

/**
 * 윈도우 매니저 초기화
 */
export const initializeWindowManager = () => {
  console.log('윈도우 매니저가 초기화되었습니다.')
} 