import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../common/ui/Button";
import { Input } from "../common/ui/Input";
import { Textarea } from "../common/ui/Textarea";
import { type Note } from "../types/NoteType";
import { FiTag, FiLink, FiLoader } from "react-icons/fi";
import { fetchAITags } from "../api/ai";

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
  linkedTasks: z.string().optional(),
});

export type NoteFormData = z.infer<typeof noteSchema>;

interface NoteFormProps {
  note?: Note | null;
  onSubmit: (data: Omit<Note, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onSubmit, onClose }) => {
  const [isGeneratingTags, setIsGeneratingTags] = React.useState(false);
  const [suggestedTags, setSuggestedTags] = React.useState<string[]>([]);
  const [isSuggestingTags, setIsSuggestingTags] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
      tags: note?.tags?.join(", ") || "",
      linkedTasks: note?.linkedTasks?.join(", ") || "",
    },
  });

  const content = watch("content");
  const currentTags = watch("tags");

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (content && content.length > 50) { // Only suggest for substantial content
        setIsSuggestingTags(true);
        try {
          const aiTags = await fetchAITags(content);
          const newTags = aiTags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
          setSuggestedTags(newTags);
        } catch (error) {
          console.error("Error suggesting tags:", error);
        } finally {
          setIsSuggestingTags(false);
        }
      } else {
        setSuggestedTags([]);
      }
    }, 1000); // 1-second debounce

    return () => {
      clearTimeout(handler);
    };
  }, [content]);

  const handleGenerateTags = async () => {
    if (!content) {
      alert("Please write some content to generate tags.");
      return;
    }

    setIsGeneratingTags(true);
    try {
      const generatedTagsString = await fetchAITags(content);
      const newTags = generatedTagsString.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
      setSuggestedTags(prev => Array.from(new Set([...prev, ...newTags])));
    } catch (error) {
      console.error("Failed to generate tags:", error);
      alert("Failed to generate tags. Please check your API key and try again.");
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const handleAddSuggestedTag = (tag: string) => {
    const existingTags = currentTags ? currentTags.split(",").map(t => t.trim()) : [];
    if (!existingTags.includes(tag)) {
      const newTags = [...existingTags, tag].join(", ");
      setValue("tags", newTags, { shouldValidate: true });
    }
  };

  useEffect(() => {
    reset({
      title: note?.title || "",
      content: note?.content || "",
      tags: note?.tags?.join(", ") || "",
      linkedTasks: note?.linkedTasks?.join(", ") || "",
    });
  }, [note, reset]);

  const handleFormSubmit = (data: NoteFormData) => {
    const processedData = {
        ...data,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        linkedTasks: data.linkedTasks ? data.linkedTasks.split(",").map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id)) : [],
    };
    onSubmit(processedData);
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
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-primary font-medium">Tags (comma separated)</label>
          <Button
            type="button"
            onClick={handleGenerateTags}
            isLoading={isGeneratingTags}
            loadingIcon={<FiLoader className="animate-spin" />}
            className="px-3 py-1 text-sm rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={isGeneratingTags}
          >
            {isGeneratingTags ? "Generating..." : "Generate Tags"}
          </Button>
        </div>
        <div className="relative">
          <Textarea
            {...register("tags")}
            placeholder="e.g. work, personal, ideas"
            className="min-h-[60px]"
          />
        </div>
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

        {isSuggestingTags && (
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
            <FiLoader className="animate-spin" />
            <span>Suggesting tags...</span>
          </div>
        )}

        {suggestedTags.length > 0 && !isSuggestingTags && (
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-primary text-sm">Suggestions:</span>
            {suggestedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddSuggestedTag(tag)}
                className="flex items-center gap-1 bg-green-50 text-green-600 border border-green-200 text-xs px-2 py-1 rounded-full hover:bg-green-100 transition-colors duration-200"
              >
                <FiTag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <Input
        label="Linked Tasks (comma-separated IDs)"
        labelClassName="text-primary font-medium"
        placeholder="e.g. 1, 2, 3"
        {...register("linkedTasks")}
        icon={<FiLink />}
      />

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
