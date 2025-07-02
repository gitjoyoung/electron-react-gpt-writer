import { ipcMain } from 'electron'
import { readFile, writeFile } from 'node:fs/promises'
import { getPromptsFilePath } from '../config/paths'

/**
 * 기본 프롬프트 템플릿
 */
const getDefaultPrompts = () => [
  {
    id: "1",
    name: "기고문 작성",
    content: "다음 주제에 대해 한국어로 기고문 형식의 에세이를 작성해주세요. 마크다운 형식으로 작성하며, 논리적인 구조(서론, 본론, 결론)를 갖추고, 전체 분량은 A4 1장 이상(1500자 이상)이어야 합니다. 서론에는 독자의 흥미를 유도하는 후킹 멘트를 포함하고, 본문에는 대상의 생애, 핵심 사상, 대표작, 철학적 영향 등을 쉽고 명확하게 풀어 설명해주세요. 어려운 개념은 예시나 비유를 활용하고, 결론은 독자의 생각을 유도할 수 있도록 질문형 문장으로 마무리해주세요. 전체 글은 일반 독자를 위한 인문 교양 기고문 스타일로 작성해주세요. 또한 summary는 본문 중 실제 문장에서 자연스럽게 발췌 가능한 형태로 포함되어야 하며, 글의 핵심 내용을 160자 내외로 요약할 수 있도록 작성해주세요.",
    responseFormat: "json",
    columns: ["title", "content", "summary", "nickname"]
  }
]

/**
 * 프롬프트 저장 핸들러
 */
const savePromptsHandler = async (_: any, prompts: any[]) => {
  try {
    await writeFile(getPromptsFilePath(), JSON.stringify(prompts, null, 2))
    return { success: true }
  } catch (error) {
    console.error('프롬프트 저장 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

/**
 * 프롬프트 불러오기 핸들러
 */
const loadPromptsHandler = async () => {
  try {
    const data = await readFile(getPromptsFilePath(), 'utf-8')
    return { success: true, prompts: JSON.parse(data) }
  } catch (error) {
    // 파일이 없는 경우 기본 프롬프트 반환
    if (error instanceof Error && ('code' in error) && error.code === 'ENOENT') {
      const defaultPrompts = getDefaultPrompts()
      await writeFile(getPromptsFilePath(), JSON.stringify(defaultPrompts, null, 2))
      return { success: true, prompts: defaultPrompts }
    }
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

/**
 * 프롬프트 업데이트 핸들러
 */
const updatePromptHandler = async (_: any, id: string, name: string, content: string, responseFormat: string, columns: string[]) => {
  try {
    const data = await readFile(getPromptsFilePath(), 'utf-8')
    const prompts = JSON.parse(data)
    const updatedPrompts = prompts.map((prompt: any) => 
      prompt.id === id ? { 
        ...prompt, 
        name, 
        content,
        responseFormat,
        columns,
        updatedAt: Date.now()
      } : prompt
    )
    await writeFile(getPromptsFilePath(), JSON.stringify(updatedPrompts, null, 2))
    return { success: true, prompts: updatedPrompts }
  } catch (error) {
    console.error('프롬프트 업데이트 실패:', error)
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

/**
 * 프롬프트 관련 IPC 핸들러 등록
 */
export const registerPromptHandlers = () => {
  ipcMain.handle('save-prompts', savePromptsHandler)
  ipcMain.handle('load-prompts', loadPromptsHandler)
  ipcMain.handle('update-prompt', updatePromptHandler)
  
  console.log('프롬프트 핸들러가 등록되었습니다.')
} 