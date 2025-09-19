import React, { useState, useMemo } from "react";
import { useNoteStore } from "../store/useNoteStore";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import { Button } from "../common/ui/Button";
import { Input } from "../common/ui/Input";
import { type Note } from "../types/NoteType";
import { Modal } from "../common/ui/Modal";
import { FiPlus } from "react-icons/fi";

const Notes: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useNoteStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleFormSubmit = (data: Omit<Note, 'id' | 'createdAt'>) => {
    if (editingNoteId) {
      updateNote({
        id: editingNoteId,
        createdAt: notes.find((n) => n.id === editingNoteId)!.createdAt,
        ...data,
      });
      setEditingNoteId(null);
    } else {
      addNote(data);
      setIsCreating(false);
    }
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
