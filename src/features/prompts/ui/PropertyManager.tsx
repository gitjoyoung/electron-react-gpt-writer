import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "../../../shared/ui/Button";
import { PropertyManagerProps } from "../model/types";
import { SortableItem } from "./SortableItem";

export const PropertyManager = ({
  columns,
  isEdit,
  columnInput,
  setColumnInput,
  handleAddColumn,
  handleRemoveColumn,
  setColumns,
}: PropertyManagerProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = columns.findIndex(
        (column) => `${column}-${isEdit}` === active.id
      );
      const newIndex = columns.findIndex(
        (column) => `${column}-${isEdit}` === over.id
      );

      setColumns(arrayMove(columns, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-2">
        반환 데이터 속성명
      </label>
      {columns.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={(event) => setActiveId(event.active.id as string)}
        >
          <div
            className={`flex gap-1 mb-2 min-h-[40px] p-2 rounded-lg border-2 border-dashed transition-colors
              ${
                activeId
                  ? "border-blue-400 bg-blue-100/50"
                  : "border-blue-200 bg-blue-50/50"
              }`}
          >
            <SortableContext
              items={columns.map((column) => `${column}-${isEdit}`)}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column, index) => (
                <SortableItem
                  key={`${column}-${isEdit}`}
                  id={`${column}-${isEdit}`}
                  column={column}
                  index={index}
                  isEdit={isEdit}
                  onRemove={() => handleRemoveColumn(index, isEdit)}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      ) : (
        <div className="flex gap-1 mb-2 min-h-[40px] p-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="text-gray-400 text-sm text-center w-full py-2">
            아래에서 속성을 추가하면 드래그하여 순서를 변경할 수 있습니다
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={columnInput}
          onChange={(e) => setColumnInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddColumn(isEdit)}
          placeholder="새 속성명"
          className="w-40 p-2 border rounded"
        />
        <Button
          size="sm"
          className="bg-green-500 text-white"
          onClick={() => handleAddColumn(isEdit)}
        >
          추가
        </Button>
      </div>
    </div>
  );
}; 