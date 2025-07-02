import { createClient } from '@supabase/supabase-js'

// 환경변수에서 Supabase 설정 가져오기
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 환경변수가 설정되지 않은 경우 에러 처리
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경변수가 설정되지 않았습니다.')
  console.error('VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해주세요.')
}

// Supabase 클라이언트 생성
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// 타입 정의 (필요에 따라 확장)
export interface Database {
  // 여기에 데이터베이스 스키마 타입을 정의할 수 있습니다
}

// Supabase 클라이언트 타입
export type SupabaseClient = typeof supabase 