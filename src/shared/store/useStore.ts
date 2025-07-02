import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PromptTemplate } from '../api/electron'

interface AppState {
  apiKey: string
  selectedPrompt: PromptTemplate | null
  setApiKey: (key: string) => void
  setSelectedPrompt: (prompt: PromptTemplate | null) => void
  addPrompt: (
    name: string,
    content: string,
    responseFormat: string,
    columns: string[]
  ) => Promise<PromptTemplate | undefined>
  removePrompt: (id: string) => Promise<void>
  updatePrompt: (
    id: string,
    name: string,
    content: string,
    responseFormat: string,
    columns: string[]
  ) => Promise<void>
  togglePromptSelection: (prompt: PromptTemplate) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      apiKey: '',
      selectedPrompt: null,
      setApiKey: (key) => set({ apiKey: key }),
      setSelectedPrompt: (prompt) => set({ selectedPrompt: prompt }),

      addPrompt: async (name, content, responseFormat, columns) => {
        if (!name.trim() || !content.trim()) {
          throw new Error('프롬프트 이름과 내용은 필수입니다.')
        }

        try {
          const result = await window.electronAPI.loadPrompts()
          if (!result.success || !result.prompts) {
            throw new Error('프롬프트 목록을 불러오는데 실패했습니다.')
          }

          const newPrompt: PromptTemplate = {
            id: Date.now().toString(),
            name,
            content,
            responseFormat,
            columns,
            updatedAt: Date.now()
          }

          const saveResult = await window.electronAPI.savePrompts([...result.prompts, newPrompt])
          
          if (!saveResult.success) {
            throw new Error(saveResult.error || '프롬프트 저장에 실패했습니다.')
          }

          return newPrompt
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
          throw new Error(`프롬프트 추가 실패: ${errorMessage}`)
        }
      },

      removePrompt: async (id) => {
        try {
          const result = await window.electronAPI.loadPrompts()
          if (!result.success || !result.prompts) {
            throw new Error('프롬프트 목록을 불러오는데 실패했습니다.')
          }

          const updatedPrompts = result.prompts.filter(p => p.id !== id)
          const saveResult = await window.electronAPI.savePrompts(updatedPrompts)
          
          if (!saveResult.success) {
            throw new Error(saveResult.error || '프롬프트 삭제에 실패했습니다.')
          }

          set((state) => ({
            selectedPrompt: state.selectedPrompt?.id === id ? null : state.selectedPrompt
          }))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
          throw new Error(`프롬프트 삭제 실패: ${errorMessage}`)
        }
      },

      updatePrompt: async (id, name, content, responseFormat, columns) => {
        if (!name.trim() || !content.trim()) {
          throw new Error('프롬프트 이름과 내용은 필수입니다.')
        }

        try {
          const result = await window.electronAPI.loadPrompts()
          if (!result.success || !result.prompts) {
            throw new Error('프롬프트 목록을 불러오는데 실패했습니다.')
          }

          const updatedPrompt: PromptTemplate = {
            id,
            name,
            content,
            responseFormat,
            columns,
            updatedAt: Date.now()
          }

          const updatedPrompts = result.prompts.map(p => 
            p.id === id ? updatedPrompt : p
          )

          const saveResult = await window.electronAPI.savePrompts(updatedPrompts)
          
          if (!saveResult.success) {
            throw new Error(saveResult.error || '프롬프트 수정에 실패했습니다.')
          }

          set((state) => ({
            selectedPrompt: state.selectedPrompt?.id === id ? updatedPrompt : state.selectedPrompt
          }))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
          throw new Error(`프롬프트 수정 실패: ${errorMessage}`)
        }
      },

      togglePromptSelection: (prompt) => {
        set((state) => ({
          selectedPrompt: state.selectedPrompt?.id === prompt.id ? null : prompt
        }))
      }
    }),
    {
      name: 'app-state'
    }
  )
) 