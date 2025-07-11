import { ipcRenderer, contextBridge, shell } from 'electron'
import type { ChatHistory } from '../../src/shared/api/electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  // API 키 관련
  saveApiKey: (apiKey: string) => ipcRenderer.invoke('save-api-key', apiKey),
  loadApiKeys: () => ipcRenderer.invoke('load-api-keys'),
  removeApiKey: (apiKey: string) => ipcRenderer.invoke('remove-api-key', apiKey),

  // 프롬프트 관련
  savePrompts: (prompts: any[]) => ipcRenderer.invoke('save-prompts', prompts),
  loadPrompts: () => ipcRenderer.invoke('load-prompts'),
  updatePromptTemplate: (template: any) => ipcRenderer.invoke('update-prompt', 
    template.id, 
    template.name, 
    template.content, 
    template.responseFormat, 
    template.columns
  ),

  // 채팅 관련
  chatGPT: (prompt: string, apiKey: string) => ipcRenderer.invoke('chatGPT', prompt, apiKey),
  loadChatHistory: () => ipcRenderer.invoke('loadChatHistory'),
  saveChatHistory: (history: any[]) => ipcRenderer.invoke('saveChatHistory', history),
  deleteChatHistory: (timestamp: string) => ipcRenderer.invoke('deleteChatHistory', timestamp),
  deleteAllChatHistory: () => ipcRenderer.invoke('deleteAllChatHistory'),

  // 자동화 관련
  loadAutomationHistory: () => ipcRenderer.invoke('loadAutomationHistory'),
  saveAutomationHistory: (history: any[]) => ipcRenderer.invoke('saveAutomationHistory', history),
  exportAutomationHistory: (history: any[]) => ipcRenderer.invoke('exportAutomationHistory', history),

  // UI 관련
  showMessageBox: (options: any) => ipcRenderer.invoke('showMessageBox', options),
  showErrorBox: (title: string, content: string) => ipcRenderer.invoke('show-error-box', title, content),
  showNotification: (title: string, body: string, type: 'success' | 'error' | 'info') => ipcRenderer.invoke('show-notification', title, body, type),

  // 내보내기 관련
  exportChatHistory: (history: ChatHistory[]) => ipcRenderer.invoke('export-chat-history', history),
  exportChatHistoryJson: (history: ChatHistory[]) => ipcRenderer.invoke('export-chat-history-json', history),

  // OpenAI API 키 관리
  setOpenAIKey: (key: string) => ipcRenderer.invoke('setOpenAIKey', key),
  getOpenAIKey: () => ipcRenderer.invoke('getOpenAIKey'),
  removeOpenAIKey: () => ipcRenderer.invoke('removeOpenAIKey'),
});

// 외부 링크 열기는 electron 객체를 통해 직접 shell.openExternal 사용
contextBridge.exposeInMainWorld('electron', {
  openExternal: (url: string) => shell.openExternal(url)
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child)
    }
  },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)