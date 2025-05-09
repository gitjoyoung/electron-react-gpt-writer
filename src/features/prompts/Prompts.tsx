import { useState } from "react";
import { Button } from "../../shared/ui/Button";
import { PropertyManager } from "./ui/PropertyManager";
import type { PromptTemplate } from "../../shared/api/electron";
import type { PromptSelectorProps } from "./model/types";

export const PromptSelector = ({
  promptTemplates,
  selectedPrompt,
  togglePromptSelection,
  addPrompt,
  removePrompt,
  updatePrompt,
}: PromptSelectorProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newPromptName, setNewPromptName] = useState("");
  const [newPromptContent, setNewPromptContent] = useState("");
  const [newPromptResponseFormat, setNewPromptResponseFormat] =
    useState("json");
  const [newPromptColumns, setNewPromptColumns] = useState<string[]>([]);
  const [newColumnInput, setNewColumnInput] = useState("");
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editResponseFormat, setEditResponseFormat] = useState("json");
  const [editColumns, setEditColumns] = useState<string[]>([]);
  const [editColumnInput, setEditColumnInput] = useState("");

  const handleAddColumn = (isEdit: boolean) => {
    const columnInput = isEdit ? editColumnInput : newColumnInput;
    if (!columnInput.trim()) return;

    if (isEdit) {
      setEditColumns([...editColumns, columnInput.trim()]);
      setEditColumnInput("");
    } else {
      setNewPromptColumns([...newPromptColumns, columnInput.trim()]);
      setNewColumnInput("");
    }
  };

  const handleRemoveColumn = (index: number, isEdit: boolean) => {
    if (isEdit) {
      setEditColumns(editColumns.filter((_, i) => i !== index));
    } else {
      setNewPromptColumns(newPromptColumns.filter((_, i) => i !== index));
    }
  };

  const handleNewPrompt = async () => {
    if (!newPromptName.trim() || !newPromptContent.trim()) {
      await window.electronAPI.showMessageBox({
        type: "warning",
        title: "입력 확인",
        message: "프롬프트 이름과 내용을 입력해주세요.",
      });
      return;
    }

    try {
      const result = await addPrompt(
        newPromptName,
        newPromptContent,
        newPromptResponseFormat,
        newPromptColumns
      );

      if (result) {
        setNewPromptName("");
        setNewPromptContent("");
        setNewPromptResponseFormat("json");
        setNewPromptColumns([]);
        await window.electronAPI.showMessageBox({
          type: "info",
          title: "저장 완료",
          message: "프롬프트가 성공적으로 저장되었습니다.",
        });
      }
    } catch (error) {
      console.error("프롬프트 추가 실패:", error);
      await window.electronAPI.showMessageBox({
        type: "error",
        title: "저장 실패",
        message: error instanceof Error ? error.message : "프롬프트 저장에 실패했습니다."
      });
    }
  };

  const handleSave = async (promptId: string) => {
    if (!editName.trim() || !editContent.trim()) {
      await window.electronAPI.showMessageBox({
        type: "warning",
        title: "입력 확인",
        message: "프롬프트 이름과 내용을 입력해주세요.",
      });
      return;
    }

    try {
      await updatePrompt(
        promptId,
        editName,
        editContent,
        editResponseFormat,
        editColumns
      );

      setEditingPromptId(null);
      resetEditForm();
      await window.electronAPI.showMessageBox({
        type: "info",
        title: "수정 완료",
        message: "프롬프트가 성공적으로 수정되었습니다.",
      });
    } catch (error) {
      console.error("프롬프트 수정 실패:", error);
      await window.electronAPI.showMessageBox({
        type: "error",
        title: "수정 실패",
        message: error instanceof Error ? error.message : "프롬프트 수정에 실패했습니다."
      });
    }
  };

  const startEditing = (prompt: PromptTemplate) => {
    setEditingPromptId(prompt.id);
    setEditName(prompt.name);
    setEditContent(prompt.content);
    setEditResponseFormat(prompt.responseFormat);
    setEditColumns(prompt.columns || []);
  };

  const resetEditForm = () => {
    setEditingPromptId(null);
    setEditName("");
    setEditContent("");
    setEditResponseFormat("json");
    setEditColumns([]);
    setEditColumnInput("");
  };

  const renderPromptForm = () => (
    <div className="mb-4 p-3 text-xs bg-white rounded shadow">
      <input
        type="text"
        value={newPromptName}
        onChange={(e) => setNewPromptName(e.target.value)}
        placeholder="프롬프트 이름"
        className="w-full p-2 mb-2 h-full border rounded"
      />
      <textarea
        value={newPromptContent}
        onChange={(e) => setNewPromptContent(e.target.value)}
        placeholder="프롬프트 내용"
        className="w-full p-2 mb-2 h-full border rounded"
        rows={15}
      />
      <div className="mb-4">
        <label className="block font-medium  text-gray-700 mb-2">
          반환 형식
        </label>
        <select
          value={newPromptResponseFormat}
          onChange={(e) => setNewPromptResponseFormat(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="json">JSON</option>
        </select>
      </div>
      <PropertyManager
        columns={newPromptColumns}
        isEdit={false}
        columnInput={newColumnInput}
        setColumnInput={setNewColumnInput}
        handleAddColumn={handleAddColumn}
        handleRemoveColumn={handleRemoveColumn}
        setColumns={setNewPromptColumns}
      />
      <div className="flex justify-center">
        <Button onClick={handleNewPrompt}>프롬프트 추가</Button>
      </div>
    </div>
  );

  const renderPromptDetailList = () => (
    <div className="space-y-2">
      {promptTemplates.map((prompt) => (
        <div key={prompt.id} className="p-3 bg-white rounded border">
          <div className="flex justify-between items-center mb-2 text-sm border-b border-black py-2 ">
            {editingPromptId === prompt.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="font-bold border rounded px-2 py-1   focus:border-blue-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave(prompt.id)}>
                    저장
                  </Button>
                  <Button size="sm" variant="danger" onClick={resetEditForm}>
                    취소
                  </Button>
                </div>
              </>
            ) : (
              <>
                <span className="font-bold">{prompt.name}</span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => startEditing(prompt)}>
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => removePrompt(prompt.id)}
                  >
                    삭제
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className="border p-2 rounded-md">
          {editingPromptId === prompt.id ? (
            <div className="text-xs ">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 text-xs text-gray-600 border rounded focus:border-blue-500 focus:outline-none mb-2"
                rows={15}
              />
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">
                  반환 형식
                </label>
                <select
                  value={editResponseFormat}
                  onChange={(e) => setEditResponseFormat(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                >
                  <option value="json">JSON</option>
                </select>
              </div>
              <PropertyManager
                columns={editColumns}
                isEdit={true}
                columnInput={editColumnInput}
                setColumnInput={setEditColumnInput}
                handleAddColumn={handleAddColumn}
                handleRemoveColumn={handleRemoveColumn}
                setColumns={setEditColumns}
              />
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 whitespace-pre-wrap mb-2">
                {prompt.content}
              </p>
              <div className="border-t pt-2">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">반환 형식:</span>
                  {prompt.responseFormat}
                </p>
                <div className="flex flex-wrap gap-2">
                  {prompt.columns?.map((column, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 rounded px-2 py-1 text-sm"
                    >
                      {column}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPromptList = () => (
    <div className="flex flex-wrap gap-2 mt-1">
      {promptTemplates.map((prompt) => (
        <div
          key={prompt.id}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${
            selectedPrompt?.id === prompt.id
              ? "bg-blue-100 border border-blue-300"
              : "bg-white border border-gray-300"
          } cursor-pointer`}
          onClick={() => togglePromptSelection(prompt)}
        >
          <div className="flex items-center">
            <span className="text-xs font-medium">{prompt.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removePrompt(prompt.id);
              }}
              className="ml-1 text-red-500 bg-transparent border-0"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if (promptTemplates.length === 0 && !showForm) {
    return (
      <div className="p-3 bg-gray-50 rounded text-center">
        <p className="mb-2 text-gray-600">등록된 프롬프트가 없습니다.</p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          프롬프트 추가하기
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 shadow-md bg-white rounded min-w-sm mx-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">프롬프트</h3>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingPromptId(null);
          }}
          className="text-xs"
        >
          {showForm ? "간단히 보기" : "프롬프트 추가"}
        </Button>
      </div>

      {showForm && renderPromptForm()}
      {showForm ? renderPromptDetailList() : renderPromptList()}
    </div>
  );
};
