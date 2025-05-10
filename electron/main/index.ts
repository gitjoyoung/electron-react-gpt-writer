import { app, BrowserWindow, shell, ipcMain, dialog, Notification } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { update } from './update'
import { readFile, writeFile } from 'node:fs/promises'
import OpenAI from 'openai'
import type { ChatHistory } from '../../src/shared/api/electron'
import { config } from 'dotenv'
import fetch from 'node-fetch'
import fs from 'node:fs'
import XLSX from 'xlsx'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load environment variables
config()

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

// 개발 환경에서는 프로젝트 루트에, 프로덕션 환경에서는 사용자 데이터 디렉토리에 저장
const API_KEYS_FILE = process.env.NODE_ENV === 'development' 
  ? path.join(process.env.APP_ROOT, 'api-keys.json')
  : path.join(app.getPath('userData'), 'api-keys.json')

const PROMPTS_FILE = process.env.NODE_ENV === 'development'
  ? path.join(process.env.APP_ROOT, 'prompts.json')
  : path.join(app.getPath('userData'), 'prompts.json')

// 채팅 내역 파일 경로
const CHAT_HISTORY_PATH = path.join(process.env.APP_ROOT, 'chat-history.json');

// 자동화 내역 파일 경로
const AUTOMATION_HISTORY_PATH = path.join(process.env.APP_ROOT, 'automation-history.json');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload,
      contextIsolation: true,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Auto update
  update(win)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// API 키 저장 핸들러
ipcMain.handle('save-api-key', async (_, apiKey: string) => {
  try {
    let keys: string[] = []
    try {
      const data = await readFile(API_KEYS_FILE, 'utf-8')
      keys = JSON.parse(data)
    } catch (error) {
      // 파일이 없거나 읽기 실패시 빈 배열 사용
      keys = []
    }

    if (!keys.includes(apiKey)) {
      keys.push(apiKey)
      await writeFile(API_KEYS_FILE, JSON.stringify(keys, null, 2))
    }
    return { success: true }
  } catch (error) {
    console.error('API 키 저장 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
})

// API 키 목록 불러오기 핸들러
ipcMain.handle('load-api-keys', async () => {
  try {
    const data = await readFile(API_KEYS_FILE, 'utf-8')
    return { success: true, keys: JSON.parse(data) }
  } catch (error) {
    // 파일이 없는 경우 빈 배열 반환
    if (error instanceof Error && ('code' in error) && error.code === 'ENOENT') {
      return { success: true, keys: [] }
    }
    console.error('API 키 불러오기 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
})

// API 키 삭제 핸들러
ipcMain.handle('remove-api-key', async (_, apiKey: string) => {
  try {
    const data = await readFile(API_KEYS_FILE, 'utf-8')
    let keys = JSON.parse(data)
    keys = keys.filter((key: string) => key !== apiKey)
    await writeFile(API_KEYS_FILE, JSON.stringify(keys, null, 2))
    return { success: true }
  } catch (error) {
    console.error('API 키 삭제 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
})

// 프롬프트 저장 핸들러
ipcMain.handle('save-prompts', async (_, prompts: any[]) => {
  try {
    await writeFile(PROMPTS_FILE, JSON.stringify(prompts, null, 2));
    return { success: true };
  } catch (error) {
    console.error('프롬프트 저장 실패:', error);
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
});

// 프롬프트 불러오기 핸들러
ipcMain.handle('load-prompts', async () => {
  try {
    const data = await readFile(PROMPTS_FILE, 'utf-8');
    return { success: true, prompts: JSON.parse(data) };
  } catch (error) {
    // 파일이 없는 경우 기본 프롬프트 반환
    if (error instanceof Error && ('code' in error) && error.code === 'ENOENT') {
      const defaultPrompts = [
        {
          id: "1",
          name: "기고문 작성",
          content: "다음 주제에 대해 한국어로 기고문 형식의 에세이를 작성해주세요. 마크다운 형식으로 작성하며, 논리적인 구조(서론, 본론, 결론)를 갖추고, 전체 분량은 A4 1장 이상(1500자 이상)이어야 합니다. 서론에는 독자의 흥미를 유도하는 후킹 멘트를 포함하고, 본문에는 대상의 생애, 핵심 사상, 대표작, 철학적 영향 등을 쉽고 명확하게 풀어 설명해주세요. 어려운 개념은 예시나 비유를 활용하고, 결론은 독자의 생각을 유도할 수 있도록 질문형 문장으로 마무리해주세요. 전체 글은 일반 독자를 위한 인문 교양 기고문 스타일로 작성해주세요. 또한 summary는 본문 중 실제 문장에서 자연스럽게 발췌 가능한 형태로 포함되어야 하며, 글의 핵심 내용을 160자 내외로 요약할 수 있도록 작성해주세요."
,
          responseFormat: "json",
          columns: ["title", "content", "summary", "nickname"]
        }
        
      ];
      await writeFile(PROMPTS_FILE, JSON.stringify(defaultPrompts, null, 2));
      return { success: true, prompts: defaultPrompts };
    }
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
});

// 프롬프트 업데이트 핸들러
ipcMain.handle('update-prompt', async (_, id: string, name: string, content: string, responseFormat: string, columns: string[]) => {
  try {
    const data = await readFile(PROMPTS_FILE, 'utf-8');
    const prompts = JSON.parse(data);
    const updatedPrompts = prompts.map((prompt: any) => 
      prompt.id === id ? { 
        ...prompt, 
        name, 
        content,
        responseFormat,
        columns,
        updatedAt: Date.now()
      } : prompt
    );
    await writeFile(PROMPTS_FILE, JSON.stringify(updatedPrompts, null, 2));
    return { success: true, prompts: updatedPrompts };
  } catch (error) {
    console.error('프롬프트 업데이트 실패:', error);
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
});

// 채팅 내역 엑셀 내보내기 핸들러
ipcMain.handle('export-chat-history', async (_, history: any[]) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // 데이터를 워크시트 형식으로 변환 (키를 그대로 사용)
    const worksheet = XLSX.utils.json_to_sheet(history);

    // 기본 칼럼 너비 설정
    const wscols = Object.keys(history[0] || {}).map(() => ({ wch: 25 }));
    worksheet['!cols'] = wscols;

    // 워크시트를 워크북에 추가
    XLSX.utils.book_append_sheet(workbook, worksheet, '채팅 내역');

    // 저장할 파일 경로 선택
    const { filePath } = await dialog.showSaveDialog({
      title: '채팅 내역 저장',
      defaultPath: 'chat-history.xlsx',
      filters: [
        { name: 'Excel 파일', extensions: ['xlsx'] }
      ]
    });

    if (!filePath) {
      return { success: false, error: '저장이 취소되었습니다.' };
    }

    // 엑셀 파일 저장
    XLSX.writeFile(workbook, filePath);
    
    return { success: true };
  } catch (error) {
    console.error('채팅 내역 내보내기 실패:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
    };
  }
});

// ChatGPT 핸들러
ipcMain.handle('chatGPT', async (_, prompt: string, apiKey: string) => {
  try {
    const openai = new OpenAI({
      apiKey: apiKey
    })
    console.log("prompt" , prompt)

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 2048, // GPT-3.5-turbo의 최대 토큰 수
    })

    const message = completion.choices[0]?.message?.content
    if (!message) {
      throw new Error('응답이 없습니다.')
    }

    return { success: true, message }
  } catch (error) {
    console.error('ChatGPT 요청 실패:', error)
    let errorMessage = '알 수 없는 오류가 발생했습니다.'
    
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        errorMessage = 'Invalid API key'
      } else {
        errorMessage = error.message
      }
    }
    
    return { success: false, error: errorMessage }
  }
})

// 알림 핸들러
ipcMain.handle('show-notification', (_, title: string, body: string, type: 'success' | 'error' | 'info') => {
  try {
    new Notification({
      title,
      body,
      icon: type === 'error'
        ? path.join(process.env.VITE_PUBLIC!, 'error.png')
        : type === 'success'
          ? path.join(process.env.VITE_PUBLIC!, 'success.png')
          : path.join(process.env.VITE_PUBLIC!, 'info.png')
    }).show()
    return { success: true }
  } catch (error) {
    console.error('알림 표시 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
})

// 메시지 박스 핸들러
ipcMain.handle('show-message-box', async (_, options) => {
  try {
    const result = await dialog.showMessageBox(win!, options)
    return { success: true, result }
  } catch (error) {
    console.error('메시지 박스 표시 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
})

// 에러 박스 핸들러
ipcMain.handle('show-error-box', (_, title: string, content: string) => {
  try {
    dialog.showErrorBox(title, content)
    return { success: true }
  } catch (error) {
    console.error('에러 박스 표시 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
})

// openExternal 핸들러 추가
ipcMain.handle('open-external', async (_, url: string) => {
  try {
    await shell.openExternal(url)
    return { success: true }
  } catch (error) {
    console.error('외부 링크 열기 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
})

// 채팅 내역 로드
ipcMain.handle('loadChatHistory', async () => {
  try {
    if (!fs.existsSync(CHAT_HISTORY_PATH)) {
      return { success: true, history: [] };
    }

    const data = await fs.promises.readFile(CHAT_HISTORY_PATH, 'utf-8');
    const history = JSON.parse(data);
    return { success: true, history };
  } catch (error) {
    console.error('채팅 내역 로드 실패:', error);
    return { success: false, error: '채팅 내역을 불러오는데 실패했습니다.' };
  }
});

// 채팅 내역 저장
ipcMain.handle('saveChatHistory', async (_, history) => {
  try {
    await fs.promises.writeFile(CHAT_HISTORY_PATH, JSON.stringify(history, null, 2));
    return { success: true };
  } catch (error) {
    console.error('채팅 내역 저장 실패:', error);
    return { success: false, error: '채팅 내역을 저장하는데 실패했습니다.' };
  }
});

// 채팅 내역 삭제
ipcMain.handle('deleteChatHistory', async (_, timestamp) => {
  try {
    const data = await fs.promises.readFile(CHAT_HISTORY_PATH, 'utf-8');
    const history = JSON.parse(data);
    const updatedHistory = history.filter((item: any) => item.timestamp !== timestamp);
    await fs.promises.writeFile(CHAT_HISTORY_PATH, JSON.stringify(updatedHistory, null, 2));
    return { success: true };
  } catch (error) {
    console.error('채팅 내역 삭제 실패:', error);
    return { success: false, error: '채팅 내역을 삭제하는데 실패했습니다.' };
  }
});
