import { app } from 'electron'
import { createRequire } from 'node:module'
import type { UpdateInfo } from 'electron-updater'

const { autoUpdater } = createRequire(import.meta.url)('electron-updater')

/**
 * 업데이트 서비스 설정
 */
export const setupUpdateService = (mainWindow: Electron.BrowserWindow) => {
  // 자동 다운로드 비활성화 (API를 통해 수동 트리거)
  autoUpdater.autoDownload = false
  autoUpdater.disableWebInstaller = false
  autoUpdater.allowDowngrade = false

  // 업데이트 확인 시작 이벤트
  autoUpdater.on('checking-for-update', () => {
    console.log('업데이트 확인 중...')
  })

  // 업데이트 사용 가능 이벤트
  autoUpdater.on('update-available', (updateInfo: UpdateInfo) => {
    console.log('새 업데이트 사용 가능:', updateInfo.version)
    mainWindow.webContents.send('update-can-available', { 
      update: true, 
      version: app.getVersion(), 
      newVersion: updateInfo?.version 
    })
  })

  // 업데이트 사용 불가 이벤트
  autoUpdater.on('update-not-available', (updateInfo: UpdateInfo) => {
    console.log('업데이트 없음:', updateInfo.version)
    mainWindow.webContents.send('update-can-available', { 
      update: false, 
      version: app.getVersion(), 
      newVersion: updateInfo?.version 
    })
  })

  // 업데이트 에러 이벤트
  autoUpdater.on('error', (error: Error) => {
    console.error('업데이트 에러:', error)
    mainWindow.webContents.send('update-error', { 
      message: error.message, 
      error 
    })
  })

  console.log('업데이트 서비스가 설정되었습니다.')
}

/**
 * 업데이트 확인 시작
 */
export const checkForUpdates = async () => {
  if (!app.isPackaged) {
    console.log('개발 환경에서는 업데이트를 확인하지 않습니다.')
    return
  }

  try {
    await autoUpdater.checkForUpdatesAndNotify()
  } catch (error) {
    console.error('업데이트 확인 실패:', error)
  }
}

/**
 * 자동 업데이트 인스턴스 가져오기
 */
export const getAutoUpdater = () => autoUpdater
 