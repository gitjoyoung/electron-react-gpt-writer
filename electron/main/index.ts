import { app, BrowserWindow } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { config } from 'dotenv'

// 설정 및 서비스 모듈 import
import { APP_ROOT } from './config/paths'
import { createMainWindow, focusMainWindow, closeAllWindows, initializeWindowManager } from './services/windowManager'
import { registerAllHandlers, cleanupHandlers } from './handlers'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 환경변수 로드
config()

// 언어 및 인코딩 설정
app.commandLine.appendSwitch('lang', 'ko-KR')
app.commandLine.appendSwitch('locale', 'ko-KR')
process.env.LANG = 'ko_KR.UTF-8'
process.env.LC_ALL = 'ko_KR.UTF-8'

// 앱 루트 설정
process.env.APP_ROOT = APP_ROOT

// GPU 가속 비활성화 (Windows 7용)
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Windows 10+ 알림용 앱 이름 설정
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// 싱글 인스턴스 보장
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

/**
 * 앱 초기화
 */
const initializeApp = async () => {
  console.log('=== 일렉트론 메인 프로세스 환경변수 체크 ===')
  console.log('현재 언어 설정: 한국어')
  
  // 환경변수 출력
  console.log('🔧 환경변수 상태:')
  console.log('  - NODE_ENV:', process.env.NODE_ENV || '미설정')
  console.log('  - APP_ROOT:', process.env.APP_ROOT || '미설정')
  console.log('  - LANG:', process.env.LANG || '미설정')
  console.log('  - LC_ALL:', process.env.LC_ALL || '미설정')
  
  // Supabase 관련 환경변수
  console.log('🗄️ Supabase 환경변수:')
  console.log('  - VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || '미설정')
  console.log('  - VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY || '미설정')
  
  // OpenAI 관련 환경변수
  console.log('🤖 OpenAI 환경변수:')
  console.log('  - OPENAI_API_KEY:', process.env.OPENAI_API_KEY || '미설정')
  
  // 기타 환경변수
  console.log('📁 파일 경로:')
  console.log('  - __dirname:', __dirname)
  console.log('  - process.cwd():', process.cwd())
  
  // 전체 환경변수 출력 (개발 모드에서만)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 모든 환경변수:')
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('VITE_') || key.includes('OPENAI') || key.includes('SUPABASE')) {
        console.log(`  - ${key}:`, process.env[key])
      }
    })
  }
  
  console.log('================================================')
  
  // 윈도우 매니저 초기화
  initializeWindowManager()
  
  // IPC 핸들러 등록
  registerAllHandlers()
  
  // 메인 윈도우 생성
  await createMainWindow()
}

/**
 * 앱 이벤트 핸들러들
 */

// 앱 준비 완료 시
app.whenReady().then(initializeApp)

// 모든 창이 닫혔을 때
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 앱 종료 전
app.on('before-quit', (event) => {
  console.log('앱이 종료됩니다...')
  cleanupHandlers()
})

// 최종 종료 전
app.on('will-quit', (event) => {
  console.log('앱이 완전히 종료됩니다...')
  closeAllWindows()
})

// 두 번째 인스턴스 실행 시도 시
app.on('second-instance', () => {
  focusMainWindow()
})

// 활성화 시 (macOS)
app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createMainWindow()
  }
})

/**
 * 프로세스 신호 처리
 */
process.on('SIGINT', () => {
  console.log('SIGINT 신호를 받았습니다. 앱을 종료합니다.')
  app.quit()
})

process.on('SIGTERM', () => {
  console.log('SIGTERM 신호를 받았습니다. 앱을 종료합니다.')
  app.quit()
})
