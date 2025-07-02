import React from "react";
import { Results } from "./widgets/results";
import { useStore } from "./shared/store/useStore";
import "./App.css";
import { Chat } from "./widgets/chat";
import { ApiKeyInput } from "./widgets/apiKey";
import { Prompts } from "./widgets/prompts";
import { Automation } from "./widgets/automation";
import { PostUpload } from "./widgets/postUpload";

function App() {
  // 필요한 상태만 선택적으로 구독
  const apiKey = useStore(state => state.apiKey);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 상단 헤더 - API 키 영역 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <ApiKeyInput />
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 왼쪽 열 - 프롬프트 & 채팅 */}
        <div className="space-y-6">
          {/* API 키가 없을 때 안내 메시지 */}
          {!apiKey && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-6 6c-1.098 0-2.1-.402-2.864-1.068A6.001 6.001 0 713 12a6.003 6.003 0 018.686-5.325M15 7v2a2 2 0 11-4 0V7m4 0V5a2 2 0 00-2-2H9.5a2 2 0 00-2 2v2M15 7h.5a2 2 0 012 2v6a2 2 0 01-2 2h-9a2 2 0 01-2-2V9a2 2 0 012-2H15z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">GPT 프롬프트 관리자</h3>
                <p className="text-gray-600 text-sm mb-4">AI와 대화하고 프롬프트를 관리하는 도구입니다</p>
                <p className="text-xs text-gray-500">시작하려면 상단에서 OpenAI API 키를 입력해주세요</p>
              </div>
            </div>
          )}
          
          {/* 프롬프트 섹션 */}
          <div>
            <Prompts />
          </div>
          
          {/* 채팅 섹션 */}
          <div>
            <Chat />
          </div>
        </div>
        
        {/* 오른쪽 열 - 자동화 & 결과 & 포스트 업로드 */}
        <div className="space-y-6">
          {/* 자동화 섹션 */}
          <div>
            <Automation />
          </div>
          
          {/* 결과 섹션 */}
          <div>
            <Results />
          </div>
          
          {/* 포스트 업로드 섹션 - 항상 표시 */}
          <div>
            <PostUpload />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
