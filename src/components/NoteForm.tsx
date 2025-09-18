import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../common/ui/Button";
import { Input } from "../common/ui/Input";
import { Textarea } from "../common/ui/Textarea";
import { type Note } from "../types/NoteType";
import { FiTag } from "react-icons/fi";

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
});

export type NoteFormData = z.infer<typeof noteSchema>;

interface NoteFormProps {
  note?: Note | null;
  onSubmit: (data: NoteFormData) => void;
  onClose: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
      tags: note?.tags?.join(", ") || "",
    },
  });

  useEffect(() => {
    reset({
      title: note?.title || "",
      content: note?.content || "",
      tags: note?.tags?.join(", ") || "",
    });
  }, [note, reset]);

  const handleFormSubmit = (data: NoteFormData) => {
    onSubmit(data);
    onClose();
  };

  const tagsValue = watch("tags") || "";
  const previewTags = tagsValue
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 overflow-y-auto max-h-[75vh] custom-scrollbar overflow-x-hidden"
    >

      {/* Title */}
      <div>
        <Input
          label="Title"
          labelClassName="text-primary font-medium"
          {...register("title")}
          error={errors.title?.message}
          placeholder="Enter a title..."
        />
      </div>

      {/* Content */}
      <div>
        <Textarea
          label="Content"
          labelClassName="text-primary font-medium"
          {...register("content")}
          error={errors.content?.message}
          placeholder="Write your note here..."
          className="resize-none h-32"
        />
      </div>

      {/* Tags */}
      <div>
        <Input
          label="Tags (comma separated)"
          labelClassName="text-primary font-medium"
          {...register("tags")}
          placeholder="e.g. work, personal, ideas"
        />
        {previewTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {previewTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 text-xs px-2 py-1 rounded-full"
              >
                <FiTag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-2 flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          className="hover:bg-red-500 border border-red-200"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" className="rounded-lg bg-[#133356] hover:bg-[#133356]/60 text-white">
          {note ? "💾 Save Changes" : "✅ Create Note"}
        </Button>
      </div>
    </form>
  );
};

export default NoteForm;
;
