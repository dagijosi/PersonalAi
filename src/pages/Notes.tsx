import React, { useState, useMemo } from "react";
import { useNoteStore } from "../store/useNoteStore";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import { Button } from "../common/ui/Button";
import { Input } from "../common/ui/Input";
import { type Note } from "../types/NoteType";
import { Modal } from "../common/ui/Modal";
import { FiPlus } from "react-icons/fi";
import NoteSummary from "../components/NoteSummary";
import { fetchAISuggestedTask } from "../api/ai";
import { type SuggestedTask } from "../types/TaskType";
import { useTaskStore } from "../store/useTaskStore";

const Notes: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useNoteStore();
  const { addTask } = useTaskStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedTask, setSuggestedTask] = useState<SuggestedTask | null>(null);
  const [showTaskSuggestionModal, setShowTaskSuggestionModal] = useState(false);

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);

  const handleAddNote = () => {
    setIsCreating(true);
    setEditingNoteId(null);
  };

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setIsCreating(false);
  };

  const handleDeleteNote = (id: number) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(id);
    }
  };

  const handleFormSubmit = async (data: Omit<Note, 'id' | 'createdAt'>) => {
    if (editingNoteId) {
      updateNote({
        id: editingNoteId,
        createdAt: notes.find((n) => n.id === editingNoteId)!.createdAt,
        ...data,
      });
    } else {
      addNote(data);
    }
    handleCancel();

    // AI Task Suggestion
    const aiSuggestedTask = await fetchAISuggestedTask(data.content);
    if (aiSuggestedTask) {
      setSuggestedTask(aiSuggestedTask);
      setShowTaskSuggestionModal(true);
    }
  };

  const handleCreateSuggestedTask = () => {
    if (suggestedTask) {
      addTask({
        title: suggestedTask.title,
        description: suggestedTask.description,
        priority: suggestedTask.priority,
        status: "todo", // Explicitly add status to satisfy type checker
      });
      setSuggestedTask(null);
      setShowTaskSuggestionModal(false);
    }
  };

  const handleDismissSuggestedTask = () => {
    setSuggestedTask(null);
    setShowTaskSuggestionModal(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingNoteId(null);
  };

  return (
    <div className="p-8 bg-background text-primary">
      <div className="mt-4 mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold font-poppins mb-6">Notes</h1>
        {!isCreating && (
          <Button onClick={handleAddNote} className="bg-primary">
            <FiPlus className="mr-2"/> Add Note
          </Button>
        )}
      </div>
      <NoteSummary />
      <Modal
        isOpen={isCreating || !!editingNoteId}
        onClose={handleCancel}
        title={editingNoteId ? "Edit Note" : "Create Note"}
      >
        <NoteForm
          note={
            editingNoteId ? notes.find((n) => n.id === editingNoteId) : null
          }
          onSubmit={handleFormSubmit}
          onClose={handleCancel}
        />
      </Modal>

      {/* Task Suggestion Modal */}
      <Modal
        isOpen={showTaskSuggestionModal}
        onClose={handleDismissSuggestedTask}
        title="AI Task Suggestion"
      >
        {suggestedTask && (
          <div className="p-4">
            <p className="text-primary mb-4">
              The AI suggests creating a task based on your note:
            </p>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {suggestedTask.title}
            </h3>
            {suggestedTask.description && (
              <p className="text-gray-700 mb-2">{suggestedTask.description}</p>
            )}
            <p className="text-sm text-gray-600 mb-4">
              Priority: <span className="font-medium">{suggestedTask.priority}</span>
            </p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleDismissSuggestedTask}
              >
                Dismiss
              </Button>
              <Button type="button" onClick={handleCreateSuggestedTask} className="bg-primary">
                Create Task
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <div className="mb-6">
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">
            No notes found.{" "}
            {searchTerm
              ? "Try a different search."
              : "Get started by adding a new note."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Notes;
