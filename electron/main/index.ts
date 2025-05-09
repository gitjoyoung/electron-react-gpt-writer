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

const require = createRequire(import.meta.url)
const XLSX = require('xlsx')
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

// 개발 환경에서 사용할 기본 API 키
const DEFAULT_API_KEY = process.env.OPENAI_API_KEY || ''

const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY || ''

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    width: 800, // 최소 크기로 시작
    height: 600, // 최소 크기로 시작
    minWidth: 800, // 최소 창 너비
    minHeight: 600, // 최소 창 높이
    webPreferences: {
      preload,
      contextIsolation: true,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

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

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
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
    // 파일이 없는 경우 개발 환경에서는 기본 API 키 반환
    if (error instanceof Error && ('code' in error) && error.code === 'ENOENT') {
      if (process.env.NODE_ENV === 'development') {
        const defaultKeys = [DEFAULT_API_KEY];
        await writeFile(API_KEYS_FILE, JSON.stringify(defaultKeys, null, 2));
        return { success: true, keys: defaultKeys };
      }
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
          name: "흥미로운 블로그 글 작성",
          content: `너는 전문 블로그 작가야. 주어진 주제에 대해 흥미롭고 매력적인 블로그 포스팅을 작성해줘.

주제: {주제}

다음 가이드라인을 따라 작성해줘:
1. 흥미로운 도입부로 시작하기
2. 실제 사례나 예시를 포함하기
3. 독자의 관심을 끌 수 있는 질문이나 생각할 거리 제시하기
4. 전문적인 정보를 쉽고 재미있게 전달하기
5. 마무리는 다음 글에 대한 기대감을 주는 방식으로

모든 내용은 반드시 한글로 작성해줘.
응답은 반드시 다음 형식의 JSON으로 반환해줘:
{
  "title": "블로그 제목",
  "content": "# 마크다운 형식의 본문\\n\\n## 소제목\\n\\n본문 내용...\\n\\n- 글머리 기호\\n- 글머리 기호\\n\\n> 인용구\\n\\n\`\`\`\\n코드 블록\\n\`\`\`",
  "nickname": "작성자 닉네임",
  "summary": "블로그 글의 핵심 요약"
}`,
          responseFormat: "json",
          columns: ["title", "content", "nickname", "summary"],
          updatedAt: Date.now()
        },
        {
          id: "2",
          name: "전문가 답변",
          content: `너는 해당 분야의 전문가야. 주어진 주제에 대해 전문적이고 깊이 있는 답변을 제공해줘.

주제: {주제}

다음 가이드라인을 따라 답변해줘:
1. 해당 분야의 전문적인 지식과 통찰력 제공
2. 실제 사례나 연구 결과를 인용하여 신뢰성 확보
3. 복잡한 개념을 명확하게 설명
4. 실용적인 조언이나 해결책 제시
5. 추가 학습이나 참고할 만한 자료 추천

모든 내용은 반드시 한글로 작성해줘.
응답은 반드시 다음 형식의 JSON으로 반환해줘:
{
  "title": "답변 제목",
  "content": "# 마크다운 형식의 전문가 답변\\n\\n## 핵심 내용\\n\\n상세 설명...\\n\\n### 예시\\n\\n- 예시 1\\n- 예시 2\\n\\n> 인용구\\n\\n\`\`\`\\n코드 예시\\n\`\`\`",
  "nickname": "전문가 닉네임",
  "summary": "답변의 핵심 요약"
}`,
          responseFormat: "json",
          columns: ["title", "content", "nickname", "summary"],
          updatedAt: Date.now()
        }
      ];
      await writeFile(PROMPTS_FILE, JSON.stringify(defaultPrompts, null, 2));
      return { success: true, prompts: defaultPrompts };
    }
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
});

// 외부 링크 열기 핸들러
ipcMain.handle('open-external', async (_, url: string) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    console.error('외부 링크 열기 실패:', error);
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
});

// dialog 핸들러 추가
ipcMain.handle('show-message-box', async (_, options) => {
  return dialog.showMessageBox(win!, options);
});

ipcMain.handle('show-error-box', async (_, title, content) => {
  dialog.showErrorBox(title, content);
});

// Unsplash 이미지 검색 핸들러
ipcMain.handle('fetch-unsplash-images', async (_, query: string) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&client_id=${UNSPLASH_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Unsplash API 요청 실패');
    }

    const data = await response.json();
    return { 
      success: true, 
      images: data.results.map((img: any) => ({
        id: img.id,
        urls: {
          regular: img.urls.regular,
          small: img.urls.small
        },
        alt_description: img.alt_description,
        user: {
          name: img.user.name,
          username: img.user.username
        }
      }))
    };
  } catch (error) {
    console.error('Unsplash 이미지 검색 실패:', error);
    return { 
      success: false, 
      images: [],
      error: error instanceof Error ? error.message : '알 수 없는 오류' 
    };
  }
});

// 채팅 기록 엑셀 내보내기 핸들러
ipcMain.handle('export-chat-history', async (_, history: any[]) => {
  try {
    // 저장 경로 선택 다이얼로그 표시
    const { filePath, canceled } = await dialog.showSaveDialog(win!, {
      title: '채팅 기록 저장',
      defaultPath: path.join(os.homedir(), 'Desktop', 'chat-history.xlsx'),
      filters: [
        { name: 'Excel 파일', extensions: ['xlsx'] }
      ]
    });

    if (canceled || !filePath) {
      return { success: false, error: '저장이 취소되었습니다.' };
    }

    // 엑셀 워크북 생성
    const workbook = XLSX.utils.book_new();
    
    // 데이터 포맷팅
    const formattedData = history.map(item => ({
      '시간': new Date(item.timestamp).toLocaleString(),
      '질문': item.query,
      '제목': item.title || '',
      '내용': item.content || '',
      '닉네임': item.nickname || '',
      '요약': item.summary || ''
    }));

    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // 열 너비 자동 조정
    worksheet['!cols'] = [
      { wch: 20 }, // 시간
      { wch: 30 }, // 질문
      { wch: 40 }, // 제목
      { wch: 50 }, // 내용
      { wch: 20 }, // 닉네임
      { wch: 40 }  // 요약
    ];

    // 워크북에 워크시트 추가
    XLSX.utils.book_append_sheet(workbook, worksheet, '채팅 기록');

    // 파일 저장
    XLSX.writeFile(workbook, filePath);

    return { success: true };
  } catch (error) {
    console.error('채팅 기록 내보내기 실패:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
    };
  }
});

// ChatGPT 핸들러
ipcMain.handle('chat-gpt', async (_, prompt: string, apiKey: string) => {
  try {
    const openai = new OpenAI({
      apiKey: apiKey
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    return {
      success: true,
      message: completion.choices[0]?.message?.content || '응답을 받지 못했습니다.'
    };
  } catch (error: any) {
    console.error('ChatGPT API 오류:', error);
    return {
      success: false,
      error: error.message || '알 수 없는 오류가 발생했습니다.'
    };
  }
});

// 알림 핸들러
ipcMain.handle('show-notification', async (_, title: string, body: string, type: 'success' | 'error' | 'info') => {
  const iconPath = {
    success: path.join(__dirname, '../resources/success.png'),
    error: path.join(__dirname, '../resources/error.png'),
    info: path.join(__dirname, '../resources/info.png')
  }[type];

  new Notification({ 
    title, 
    body, 
    icon: iconPath
  }).show();
});

// 엑셀 내보내기 핸들러
ipcMain.handle('export-to-excel', async (_, chatHistory: ChatHistory[]) => {
  try {
    const XLSX = require('xlsx');
    const workbook = XLSX.utils.book_new();
    
    // 데이터 변환
    const data = chatHistory.map((entry: ChatHistory) => ({
      '시간': new Date(entry.timestamp).toLocaleString(),
      '질문': entry.query,
      '응답': entry.response
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // 열 너비 자동 조정
    const maxWidth = 50;
    worksheet['!cols'] = [
      { wch: 20 }, // 시간
      { wch: 30 }, // 질문
      { wch: maxWidth } // 응답
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, '채팅 내역');
    
    // 파일 저장 다이얼로그
    const { filePath } = await dialog.showSaveDialog({
      title: '엑셀 파일 저장',
      defaultPath: `chat_history_${new Date().toISOString().split('T')[0]}.xlsx`,
      filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
    });
    
    if (filePath) {
      XLSX.writeFile(workbook, filePath);
      return { success: true };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Excel export error:', error);
    return { success: false };
  }
});
