import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableItemProps } from "../model/types";

export const SortableItem = ({ id, column, index, onRemove }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`inline-flex items-center bg-blue-100 rounded px-2 py-1 touch-none
        ${isDragging ? "ring-2 ring-blue-400 shadow-lg" : "hover:bg-blue-50"}`}
    >
      <div {...listeners} className="cursor-move">
        <span className="text-sm">
          <span className="text-gray-500 mr-1">{index + 1}.</span>
          {column}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-1 text-red-500 hover:text-red-700"
      >
        ×
      </button>
    </div>
  );
}; 