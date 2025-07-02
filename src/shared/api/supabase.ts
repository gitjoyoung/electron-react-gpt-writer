import { createClient } from '@supabase/supabase-js'
import { PostData, Post } from '../types/post'

// 환경변수에서 Supabase 설정 가져오기
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 유효한 URL 체크
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Supabase 클라이언트 생성
const isConfigured = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl);
export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null

/**
 * Posts 테이블 관련 API
 */
export const postsAPI = {
  async createPost(postData: PostData): Promise<{ success: boolean; data?: Post; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase가 설정되지 않았습니다.' }
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      }
    }
  },

  async getPosts(limit = 10, offset = 0): Promise<{ success: boolean; data?: Post[]; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase가 설정되지 않았습니다.' }
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      }
    }
  }
}

// 타입 정의 (필요에 따라 확장)
export interface Database {
  // 여기에 데이터베이스 스키마 타입을 정의할 수 있습니다
}

// Supabase 클라이언트 타입
export type SupabaseClient = typeof supabase 