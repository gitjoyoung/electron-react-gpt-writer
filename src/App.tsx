import { useState } from 'react';
import { Results } from "./widgets/results";
import { useStore } from "./shared/store/useStore";
import "./App.css";
import { Chat } from "./widgets/chat";
import { ApiKeyInput } from "./widgets/apiKey";
import { Prompts } from "./widgets/prompts";
import { Automation } from "./widgets/automation";

function App() {
  const { apiKey } = useStore();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <ApiKeyInput />
        
        {apiKey && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Prompts />
              <Chat />
            </div>
            <div className="space-y-4">
              <Automation />
              <Results />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
