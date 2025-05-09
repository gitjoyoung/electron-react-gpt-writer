import { useState } from 'react'
import { Chat } from './features/chat/Chat'
import { ApiKeyInput } from './features/apiKey/ApiKeyInput'
import { PromptSelector } from './features/prompts/Prompts'
import { usePrompts } from './shared/hooks/usePrompts'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState('');
  const { 
    promptTemplates, 
    selectedPrompt, 
    togglePromptSelection, 
    addPrompt, 
    removePrompt,
    updatePrompt
  } = usePrompts();

  return (
    <div className="min-h-screen flex justify-center overflow-y-auto overflow-x-hidden">
      <div className="w-full max-w-[1200px] p-4 sm:p-8 min-w-[768px] flex flex-col">
        <div className="flex-shrink-0">
          <ApiKeyInput onApiKeySelect={setApiKey} />
        </div>
        
        {apiKey && (
          <div className="space-y-4 mt-8 flex-1">
            <div className="flex-shrink-0">
              <PromptSelector 
                promptTemplates={promptTemplates}
                selectedPrompt={selectedPrompt}
                togglePromptSelection={togglePromptSelection}
                addPrompt={addPrompt}
                removePrompt={removePrompt}
                updatePrompt={updatePrompt}
              />
            </div>
            
            <div className="flex-1">
              <Chat 
                apiKey={apiKey} 
                onApiKeyChange={setApiKey} 
                selectedPrompt={selectedPrompt}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App