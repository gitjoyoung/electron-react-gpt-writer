# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트가 생성되면 Settings > API에서 다음 정보를 확인합니다:
   - Project URL
   - anon/public key

## 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

예시:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. 사용 방법

### 기본 사용법

```typescript
import { supabase } from '@/shared/api/supabase'
import { fetchData, insertData, updateData, deleteData } from '@/shared/api/supabaseUtils'

// 데이터 조회
const { data, error } = await fetchData('users')

// 데이터 삽입
const { data, error } = await insertData('users', {
  name: 'John Doe',
  email: 'john@example.com'
})

// 데이터 업데이트
const { data, error } = await updateData('users', 1, {
  name: 'Jane Doe'
})

// 데이터 삭제
const { error } = await deleteData('users', 1)
```

### 인증 사용법

```typescript
import { auth } from '@/shared/api/supabaseUtils'

// 로그인
const { data, error } = await auth.signIn('user@example.com', 'password')

// 회원가입
const { data, error } = await auth.signUp('user@example.com', 'password')

// 로그아웃
const { error } = await auth.signOut()

// 현재 사용자 정보
const { data: { user } } = await auth.getCurrentUser()
```

### 실시간 구독

```typescript
import { subscribeToChanges } from '@/shared/api/supabaseUtils'

// 테이블 변경사항 구독
const subscription = subscribeToChanges('users', (payload) => {
  console.log('변경사항:', payload)
})

// 구독 해제
subscription.unsubscribe()
```

## 4. 보안 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요
- `VITE_SUPABASE_ANON_KEY`는 공개적으로 사용되어도 안전하지만, 서비스 롤 키는 절대 클라이언트에 노출하지 마세요
- Row Level Security (RLS)를 활성화하여 데이터 접근을 제한하세요

## 5. 데이터베이스 스키마

필요에 따라 `src/shared/api/supabase.ts` 파일의 `Database` 인터페이스를 업데이트하여 타입 안전성을 확보하세요:

```typescript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          created_at?: string
        }
      }
    }
  }
}
``` 