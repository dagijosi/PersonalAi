import React from "react";
import { type Note } from "../types/NoteType";
import { Button } from "../common/ui/Button";
import { FiEdit2, FiTrash2, FiTag } from "react-icons/fi";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  return (
    <div className="bg-card p-5 rounded-xl shadow-sm border border-card hover:shadow-md transition-all duration-200 flex flex-col justify-between h-fit">
      {/* Title & Date */}
      <div>
        <h3 className="text-lg font-semibold font-jost text-primary mb-1">
          {note.title}
        </h3>
        <p className="text-xs text-gray-400">
          {new Date(note.createdAt).toLocaleDateString()}
        </p>

        {/* Content */}
        <p className="mt-3 text-sm text-light-text line-clamp-4">{note.content}</p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-200"
              >
                <FiTag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-primary border border-blue-600 hover:text-blue-600"
          onClick={() => onEdit(note)}
        >
          <FiEdit2 className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onDelete(note.id)}
        >
          <FiTrash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default NoteCard;
