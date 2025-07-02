import { createClient, type PostgrestError } from '@supabase/supabase-js'

// 기본 CRUD 작업을 위한 유틸리티 함수들

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
/**
 * 데이터 조회
 */
export async function fetchData<T>(
  table: string,
  select: string = '*',
  filters?: Record<string, any>
): Promise<{ data: T[] | null; error: PostgrestError | null }> {
  let query = supabase.from(table).select(select)
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }
  
  const result = await query
  return {
    data: result.data as T[] | null,
    error: result.error
  }
}

/**
 * 단일 데이터 조회
 */
export async function fetchSingleData<T>(
  table: string,
  id: string | number,
  select: string = '*'
): Promise<{ data: T | null; error: PostgrestError | null }> {
  const result = await supabase
    .from(table)
    .select(select)
    .eq('id', id)
    .single()
  
  return {
    data: result.data as T | null,
    error: result.error
  }
}

/**
 * 데이터 삽입
 */
export async function insertData<T>(
  table: string,
  data: Partial<T>
): Promise<{ data: T | null; error: PostgrestError | null }> {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single()
  
  return { data: result, error }
}

/**
 * 데이터 업데이트
 */
export async function updateData<T>(
  table: string,
  id: string | number,
  data: Partial<T>
): Promise<{ data: T | null; error: PostgrestError | null }> {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single()
  
  return { data: result, error }
}

/**
 * 데이터 삭제
 */
export async function deleteData(
  table: string,
  id: string | number
): Promise<{ error: PostgrestError | null }> {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
  
  return { error }
}

/**
 * 실시간 구독 설정
 */
export function subscribeToChanges<T>(
  table: string,
  callback: (payload: any) => void,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) {
  return supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes' as any,
      {
        event,
        schema: 'public',
        table
      },
      callback
    )
    .subscribe()
}

/**
 * 인증 관련 유틸리티
 */
export const auth = {
  // 로그인
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },
  
  // 회원가입
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password
    })
  },
  
  // 로그아웃
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  
  // 현재 사용자 정보 가져오기
  getCurrentUser: async () => {
    return await supabase.auth.getUser()
  },
  
  // 세션 정보 가져오기
  getSession: async () => {
    return await supabase.auth.getSession()
  }
} 