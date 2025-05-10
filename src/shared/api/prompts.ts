import type { PromptTemplate } from './electron'

const PROMPTS_FILE = process.env.NODE_ENV === 'development'
  ? 'prompts.json'
  : 'prompts.json'

export const savePrompts = async (prompts: PromptTemplate[]) => {
  try {
    const response = await window.electronAPI.savePrompts(prompts)
    return response
  } catch (error) {
    console.error('프롬프트 저장 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    }
  }
}

export const loadPrompts = async () => {
  try {
    const response = await window.electronAPI.loadPrompts()
    return response
  } catch (error) {
    console.error('프롬프트 불러오기 실패:', error)
    return {
      success: false,
      prompts: [],
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    }
  }
}

export const updatePrompt = async (template: PromptTemplate) => {
  try {
    const response = await window.electronAPI.updatePromptTemplate(template)
    return response
  } catch (error) {
    console.error('프롬프트 업데이트 실패:', error)
    throw error
  }
} 