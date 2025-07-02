import { ipcMain } from 'electron'
import OpenAI from 'openai'
import fs from 'node:fs'
import { getChatHistoryPath } from '../config/paths'

/**
 * ChatGPT API 호출 핸들러
 */
const chatGPTHandler = async (_: any, prompt: string, apiKey: string) => {
  try {
    const openai = new OpenAI({
      apiKey: apiKey
    })
    console.log("prompt:", prompt)

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 2048,
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
}

/**
 * 채팅 내역 로드 핸들러
 */
const loadChatHistoryHandler = async () => {
  try {
    const chatHistoryPath = getChatHistoryPath()
    if (!fs.existsSync(chatHistoryPath)) {
      return { success: true, history: [] }
    }

    const data = await fs.promises.readFile(chatHistoryPath, 'utf-8')
    const history = JSON.parse(data)
    return { success: true, history }
  } catch (error) {
    console.error('채팅 내역 로드 실패:', error)
    return { success: false, error: '채팅 내역을 불러오는데 실패했습니다.' }
  }
}

/**
 * 채팅 내역 저장 핸들러
 */
const saveChatHistoryHandler = async (_: any, history: any[]) => {
  try {
    const chatHistoryPath = getChatHistoryPath()
    await fs.promises.writeFile(chatHistoryPath, JSON.stringify(history, null, 2))
    return { success: true }
  } catch (error) {
    console.error('채팅 내역 저장 실패:', error)
    return { success: false, error: '채팅 내역을 저장하는데 실패했습니다.' }
  }
}

/**
 * 채팅 내역 삭제 핸들러
 */
const deleteChatHistoryHandler = async (_: any, timestamp: string) => {
  try {
    const chatHistoryPath = getChatHistoryPath()
    const data = await fs.promises.readFile(chatHistoryPath, 'utf-8')
    const history = JSON.parse(data)
    const updatedHistory = history.filter((item: any) => item.timestamp !== timestamp)
    await fs.promises.writeFile(chatHistoryPath, JSON.stringify(updatedHistory, null, 2))
    return { success: true }
  } catch (error) {
    console.error('채팅 내역 삭제 실패:', error)
    return { success: false, error: '채팅 내역을 삭제하는데 실패했습니다.' }
  }
}

/**
 * 채팅 관련 IPC 핸들러 등록
 */
export const registerChatHandlers = () => {
  ipcMain.handle('chatGPT', chatGPTHandler)
  ipcMain.handle('loadChatHistory', loadChatHistoryHandler)
  ipcMain.handle('saveChatHistory', saveChatHistoryHandler)
  ipcMain.handle('deleteChatHistory', deleteChatHistoryHandler)
  
  console.log('채팅 핸들러가 등록되었습니다.')
} 