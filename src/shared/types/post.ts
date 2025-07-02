/**
 * 포스트 전체 타입 (서버에서 받아올 때 사용)
 */
export interface Post {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  excerpt: string;
  summary: string;
  content: string;
  thumbnail: string;
  author_id: string;
  nickname: string;
  password: string;
  view_count: number;
  reading_time: number;
  tags: string[];
  is_pinned: boolean;
  category: string;
  status: string;
  category_id: string;
}

/**
 * 포스트 생성/수정 시 실제 통신에 사용되는 타입
 */
export interface PostData {
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  nickname: string;
  password: string;
  category: string;
  tags: string[];
} 