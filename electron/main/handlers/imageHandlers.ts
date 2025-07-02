import { ipcMain } from 'electron'

/**
 * 한글-영어 키워드 매핑
 */
const koreanKeywordMap: { [key: string]: string } = {
  '메론': 'melon',
  '안녕': 'hello',
  '소크라테스': 'socrates philosophy',
  '플라톤': 'plato philosophy',
  '아리스토텔레스': 'aristotle philosophy',
  '철학': 'philosophy',
  '역사': 'history',
  '예술': 'art',
  '음악': 'music',
  '자연': 'nature',
  '과학': 'science'
}

/**
 * 검색어 정제 함수
 */
const cleanSearchQuery = (query: string): string => {
  let cleanQuery = query.trim()
  
  // 한글 키워드 변환
  for (const [korean, english] of Object.entries(koreanKeywordMap)) {
    if (cleanQuery.includes(korean)) {
      cleanQuery = english
      break
    }
  }
  
  // 기본값 설정
  if (!cleanQuery || cleanQuery.length < 2) {
    cleanQuery = 'nature'
  }
  
  return cleanQuery
}

/**
 * 웹훅을 통한 이미지 검색 함수
 */
const searchImagesViaWebhook = async (query: string) => {
  const webhookUrl = process.env.IMAGE_WEBHOOK_URL || 'https://your-webhook-server.com/api/search-images'
  
  const webhookResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WEBHOOK_API_KEY || ''}`
    },
    body: JSON.stringify({
      query: query,
      count: 4,
      size: '400x300',
      source: 'unsplash'
    })
  })

  if (!webhookResponse.ok) {
    throw new Error(`웹훅 요청 실패: ${webhookResponse.status}`)
  }

  const webhookData = await webhookResponse.json()
  
  if (webhookData.success && webhookData.images) {
    return webhookData.images.map((imageData: any) => ({
      urls: {
        small: imageData.url || imageData.small || imageData.thumbnail
      }
    }))
  } else {
    throw new Error(webhookData.error || '웹훅에서 이미지를 가져오지 못했습니다.')
  }
}

/**
 * Fallback 이미지 생성 함수
 */
const generateFallbackImages = (searchQuery: string) => {
  const encodedQuery = encodeURIComponent(searchQuery)
  
  return [
    { urls: { small: `https://source.unsplash.com/400x300/?${encodedQuery}` } },
    { urls: { small: `https://source.unsplash.com/400x300/?${encodedQuery}&sig=1` } },
    { urls: { small: `https://source.unsplash.com/400x300/?${encodedQuery}&sig=2` } },
    { urls: { small: `https://source.unsplash.com/400x300/?${encodedQuery}&sig=3` } }
  ]
}

/**
 * 기본 이미지 생성 함수
 */
const generateDefaultImages = () => [
  { urls: { small: 'https://source.unsplash.com/400x300/?nature' } },
  { urls: { small: 'https://source.unsplash.com/400x300/?landscape' } },
  { urls: { small: 'https://source.unsplash.com/400x300/?abstract' } },
  { urls: { small: 'https://source.unsplash.com/400x300/?minimal' } }
]

/**
 * Unsplash 이미지 검색 핸들러 (웹훅 방식)
 */
const fetchUnsplashImagesHandler = async (_: any, query: string) => {
  try {
    console.log('이미지 검색 쿼리 (웹훅):', query)
    
    // 이미지 검색 시도 (웹훅 → Fallback → 기본 이미지)
    try {
      const images = await searchImagesViaWebhook(query)
      console.log('웹훅에서 가져온 이미지:', images)
      return { success: true, images }
    } catch (webhookError) {
      console.error('웹훅 이미지 검색 실패:', webhookError)
      
      // Fallback: 기본 Unsplash Source API 사용
      try {
        console.log('Fallback: 기본 Unsplash API 사용')
        const cleanQuery = cleanSearchQuery(query)
        const fallbackImages = generateFallbackImages(cleanQuery)
        return { success: true, images: fallbackImages }
      } catch (fallbackError) {
        console.error('Fallback도 실패:', fallbackError)
        
        // 최종 fallback: 기본 이미지
        const defaultImages = generateDefaultImages()
        return { success: true, images: defaultImages }
      }
    }
  } catch (error) {
    console.error('이미지 검색 전체 실패:', error)
    
    // 최종 안전 장치
    const defaultImages = generateDefaultImages()
    return { success: true, images: defaultImages }
  }
}

/**
 * 이미지 관련 IPC 핸들러 등록
 */
export const registerImageHandlers = () => {
  ipcMain.handle('fetch-unsplash-images', fetchUnsplashImagesHandler)
  
  console.log('이미지 핸들러가 등록되었습니다.')
} 