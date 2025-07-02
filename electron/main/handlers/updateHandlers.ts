import { app, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import type {
  ProgressInfo,
  UpdateDownloadedEvent,
  UpdateInfo,
} from 'electron-updater'

const { autoUpdater } = createRequire(import.meta.url)('electron-updater')

/**
 * 업데이트 확인 핸들러
 */
const checkUpdateHandler = async () => {
  if (!app.isPackaged) {
    const error = new Error('업데이트 기능은 패키징된 앱에서만 사용할 수 있습니다.')
    return { message: error.message, error }
  }

  try {
    return await autoUpdater.checkForUpdatesAndNotify()
  } catch (error) {
    return { message: 'Network error', error }
  }
}

/**
 * 업데이트 다운로드 시작 핸들러
 */
const startDownloadHandler = (event: Electron.IpcMainInvokeEvent) => {
  startDownload(
    (error, progressInfo) => {
      if (error) {
        // 다운로드 에러 메시지 전송
        event.sender.send('update-error', { message: error.message, error })
      } else {
        // 업데이트 진행상황 메시지 전송
        event.sender.send('download-progress', progressInfo)
      }
    },
    () => {
      // 업데이트 다운로드 완료 메시지 전송
      event.sender.send('update-downloaded')
    }
  )
}

/**
 * 앱 종료 후 업데이트 설치 핸들러
 */
const quitAndInstallHandler = () => {
  autoUpdater.quitAndInstall(false, true)
}

/**
 * 다운로드 시작 함수
 */
function startDownload(
  callback: (error: Error | null, info: ProgressInfo | null) => void,
  complete: (event: UpdateDownloadedEvent) => void,
) {
  autoUpdater.on('download-progress', (info: ProgressInfo) => callback(null, info))
  autoUpdater.on('error', (error: Error) => callback(error, null))
  autoUpdater.on('update-downloaded', complete)
  autoUpdater.downloadUpdate()
}

/**
 * 업데이트 관련 IPC 핸들러 등록
 */
export const registerUpdateHandlers = () => {
  ipcMain.handle('check-update', checkUpdateHandler)
  ipcMain.handle('start-download', startDownloadHandler)
  ipcMain.handle('quit-and-install', quitAndInstallHandler)
  
  console.log('업데이트 핸들러가 등록되었습니다.')
} 