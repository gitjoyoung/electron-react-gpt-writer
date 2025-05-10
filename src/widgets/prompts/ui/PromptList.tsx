import React, { useState } from "react";
import type { PromptListProps } from "../types";
import { Button } from "../../../shared/ui/Button";

export const PromptList: React.FC<PromptListProps & { showForm?: boolean }> = ({
  prompts,
  selectedPrompt,
  onSelect,
  onDelete,
  showForm = false,
}) => {
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editResponseFormat, setEditResponseFormat] = useState("json");
  const [editColumns, setEditColumns] = useState<string[]>([]);

  const handleStartEdit = (prompt: any) => {
    setEditingPrompt(prompt.id);
    setEditName(prompt.name);
    setEditContent(prompt.content);
    setEditResponseFormat(prompt.responseFormat);
    setEditColumns(prompt.columns || []);
  };

  const handleCancelEdit = () => {
    setEditingPrompt(null);
    setEditName("");
    setEditContent("");
    setEditResponseFormat("json");
    setEditColumns([]);
  };

  const handleSaveEdit = async (promptId: string) => {
    try {
      await window.electronAPI.updatePromptTemplate({
        id: promptId,
        name: editName,
        content: editContent,
        responseFormat: editResponseFormat,
        columns: editColumns,
        updatedAt: Date.now(),
      });
      setEditingPrompt(null);
    } catch (error) {
      console.error("프롬프트 수정 실패:", error);
      await window.electronAPI.showMessageBox({
        type: "error",
        title: "수정 실패",
        message:
          error instanceof Error
            ? error.message
            : "프롬프트 수정에 실패했습니다.",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 간단한 프롬프트 목록 - showForm이 false일 때만 표시 */}
      {!showForm && (
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${
                selectedPrompt?.id === prompt.id
                  ? "bg-blue-100 border border-blue-300"
                  : "bg-white border border-gray-300"
              } cursor-pointer`}
              onClick={() => onSelect(prompt)}
            >
              <div className="flex items-center">
                <span className="text-xs font-medium">{prompt.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(prompt.id);
                  }}
                  className="ml-1 text-red-500 bg-transparent border-0"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 프롬프트 상세 목록 - showForm이 true일 때만 표시 */}
      {showForm && (
        <div className="space-y-2">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="p-3 bg-white rounded border">
              {editingPrompt === prompt.id ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="font-medium text-xs border rounded flex-1 mr-2  px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="프롬프트 이름"
                    />
                    <div className="flex gap-2 ">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(prompt.id)}
                      >
                        저장
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={handleCancelEdit}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-80 overflow-y-scroll  border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none py-2"
                    placeholder="프롬프트 내용"
                  />
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      속성:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {editColumns.map((column, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded"
                        >
                          <span className="text-xs">{column}</span>
                          <button
                            onClick={() =>
                              setEditColumns((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-sm">{prompt.name}</h4>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleStartEdit(prompt)}>
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDelete(prompt.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 whitespace-pre-wrap">
                    {prompt.content}
                  </div>
                  {prompt.columns && prompt.columns.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        속성:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {prompt.columns.map((column, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded text-xs"
                          >
                            {column}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
