import { useState, useCallback, useRef } from 'react';
import { PostData } from '../../../shared/types/post';
import { postsAPI } from '../../../shared/api/supabase';

interface PostUploadState {
  posts: PostData[];
  isProcessing: boolean;
  currentIndex: number;
  totalCount: number;
  delay: number;
  error: string | null;
  successCount: number;
  failureCount: number;
}

// PostData 타입 검증 함수
const validatePostData = (data: any, index: number): data is PostData => {
  if (!data || typeof data !== 'object') {
    throw new Error(`항목 ${index + 1}: 객체가 아닙니다.`);
  }

  const requiredFields = ['title', 'summary', 'content', 'thumbnail', 'nickname', 'password', 'category', 'tags'];
  
  for (const field of requiredFields) {
    if (!(field in data)) {
      throw new Error(`항목 ${index + 1}: '${field}' 필드가 누락되었습니다.`);
    }
  }

  // 타입 검증
  if (typeof data.title !== 'string') {
    throw new Error(`항목 ${index + 1}: 'title'은 문자열이어야 합니다.`);
  }
  if (typeof data.summary !== 'string') {
    throw new Error(`항목 ${index + 1}: 'summary'는 문자열이어야 합니다.`);
  }
  if (typeof data.content !== 'string') {
    throw new Error(`항목 ${index + 1}: 'content'는 문자열이어야 합니다.`);
  }
  if (typeof data.thumbnail !== 'string') {
    throw new Error(`항목 ${index + 1}: 'thumbnail'은 문자열이어야 합니다.`);
  }
  if (typeof data.nickname !== 'string') {
    throw new Error(`항목 ${index + 1}: 'nickname'은 문자열이어야 합니다.`);
  }
  if (typeof data.password !== 'string') {
    throw new Error(`항목 ${index + 1}: 'password'는 문자열이어야 합니다.`);
  }
  if (typeof data.category !== 'string') {
    throw new Error(`항목 ${index + 1}: 'category'는 문자열이어야 합니다.`);
  }
  if (!Array.isArray(data.tags)) {
    throw new Error(`항목 ${index + 1}: 'tags'는 배열이어야 합니다.`);
  }
  if (!data.tags.every((tag: any) => typeof tag === 'string')) {
    throw new Error(`항목 ${index + 1}: 'tags' 배열의 모든 요소는 문자열이어야 합니다.`);
  }

  // 필수 값 체크 (빈 문자열 체크)
  if (!data.title.trim()) {
    throw new Error(`항목 ${index + 1}: 'title'은 빈 값일 수 없습니다.`);
  }
  if (!data.summary.trim()) {
    throw new Error(`항목 ${index + 1}: 'summary'는 빈 값일 수 없습니다.`);
  }
  if (!data.content.trim()) {
    throw new Error(`항목 ${index + 1}: 'content'는 빈 값일 수 없습니다.`);
  }
  if (!data.nickname.trim()) {
    throw new Error(`항목 ${index + 1}: 'nickname'은 빈 값일 수 없습니다.`);
  }
  if (!data.password.trim()) {
    throw new Error(`항목 ${index + 1}: 'password'는 빈 값일 수 없습니다.`);
  }
  if (!data.category.trim()) {
    throw new Error(`항목 ${index + 1}: 'category'는 빈 값일 수 없습니다.`);
  }

  return true;
};

// 전체 JSON 데이터 검증 함수
const validateJsonData = (jsonData: any): PostData[] => {
  // 기본 구조 검사
  if (!Array.isArray(jsonData)) {
    throw new Error('JSON 파일은 배열 형식이어야 합니다.');
  }

  if (jsonData.length === 0) {
    throw new Error('빈 배열입니다. 최소 하나 이상의 포스트 데이터가 필요합니다.');
  }

  // 각 항목 타입 검증
  jsonData.forEach((item, index) => {
    validatePostData(item, index);
  });

  return jsonData as PostData[];
};

export const usePostUpload = () => {
  const [state, setState] = useState<PostUploadState>({
    posts: [],
    isProcessing: false,
    currentIndex: 0,
    totalCount: 0,
    delay: 30000, // 기본 30초
    error: null,
    successCount: 0,
    failureCount: 0
  });

  const stopProcessingRef = useRef(false);

  const handleFileUpload = useCallback((file: File) => {
    // 파일 읽기 시작할 때 이전 에러 초기화
    setState(prev => ({
      ...prev,
      error: null,
      posts: [],
      totalCount: 0,
      currentIndex: 0,
      successCount: 0,
      failureCount: 0
    }));

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // JSON 파싱
        const jsonData = JSON.parse(e.target?.result as string);
        
        // 즉시 데이터 검증 수행
        const validatedPosts = validateJsonData(jsonData);
        
        // 검증 성공 시 상태 업데이트
        setState(prev => ({
          ...prev,
          posts: validatedPosts,
          totalCount: validatedPosts.length,
          error: null
        }));

      } catch (error) {
        // JSON 파싱 에러 또는 검증 에러 처리
        let errorMessage = '알 수 없는 오류가 발생했습니다.';
        
        if (error instanceof SyntaxError) {
          errorMessage = '올바른 JSON 파일이 아닙니다. JSON 문법을 확인해주세요.';
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setState(prev => ({
          ...prev,
          error: errorMessage,
          posts: [],
          totalCount: 0
        }));
      }
    };

    reader.onerror = () => {
      setState(prev => ({
        ...prev,
        error: '파일을 읽는 중 오류가 발생했습니다.',
        posts: [],
        totalCount: 0
      }));
    };

    reader.readAsText(file);
  }, []);

  const setDelay = useCallback((delayMs: number) => {
    // 최소 1초, 최대 1시간으로 제한
    const clampedDelay = Math.max(1000, Math.min(3600000, delayMs));
    setState(prev => ({ ...prev, delay: clampedDelay }));
  }, []);

  const startProcessing = useCallback(async () => {
    if (state.posts.length === 0) {
      setState(prev => ({ ...prev, error: 'JSON 파일을 먼저 업로드해주세요.' }));
      return;
    }

    stopProcessingRef.current = false;

    setState(prev => ({
      ...prev,
      isProcessing: true,
      currentIndex: 0,
      successCount: 0,
      failureCount: 0,
      error: null
    }));

    for (let i = 0; i < state.posts.length; i++) {
      // 중지 신호 확인
      if (stopProcessingRef.current) {
        setState(prev => ({ 
          ...prev, 
          isProcessing: false, 
          error: '사용자에 의해 중지되었습니다.' 
        }));
        return;
      }

      setState(prev => ({ ...prev, currentIndex: i + 1 }));

      try {
        const result = await postsAPI.createPost(state.posts[i]);
        
        if (result.success) {
          setState(prev => ({ ...prev, successCount: prev.successCount + 1 }));
        } else {
          setState(prev => ({ ...prev, failureCount: prev.failureCount + 1 }));
          console.error(`포스트 ${i + 1} 업로드 실패:`, result.error);
        }
      } catch (error) {
        setState(prev => ({ ...prev, failureCount: prev.failureCount + 1 }));
        console.error(`포스트 ${i + 1} 업로드 중 오류:`, error);
      }

      // 마지막 항목이 아니면 딜레이 적용 (중지 신호도 확인)
      if (i < state.posts.length - 1) {
        for (let delayCount = 0; delayCount < state.delay / 100; delayCount++) {
          if (stopProcessingRef.current) {
            setState(prev => ({ 
              ...prev, 
              isProcessing: false, 
              error: '사용자에 의해 중지되었습니다.' 
            }));
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    setState(prev => ({ ...prev, isProcessing: false }));

    // 완료 알림
    if (window.electronAPI?.showNotification) {
      await window.electronAPI.showNotification(
        '배치 업로드 완료',
        `성공: ${state.successCount + (state.failureCount === 0 ? 1 : 0)}개, 실패: ${state.failureCount}개`,
        'success'
      );
    }
  }, [state.posts, state.delay, state.successCount, state.failureCount]);

  const stopProcessing = useCallback(() => {
    stopProcessingRef.current = true;
  }, []);

  const reset = useCallback(() => {
    stopProcessingRef.current = false;
    setState({
      posts: [],
      isProcessing: false,
      currentIndex: 0,
      totalCount: 0,
      delay: 30000, // 기본값으로 리셋
      error: null,
      successCount: 0,
      failureCount: 0
    });
  }, []);

  return {
    posts: state.posts,
    isProcessing: state.isProcessing,
    currentIndex: state.currentIndex,
    totalCount: state.totalCount,
    delay: state.delay,
    error: state.error,
    successCount: state.successCount,
    failureCount: state.failureCount,
    handleFileUpload,
    setDelay,
    startProcessing,
    stopProcessing,
    reset
  };
}; 