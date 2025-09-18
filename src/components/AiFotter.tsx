import React, { useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { Button } from "../common/ui/Button";
import { Textarea } from "../common/ui/Textarea";
import type { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import CommandHints from "./CommandHints";
import type { Command } from "../data/commands";

interface AiFotterProps {
  handleSubmit: UseFormHandleSubmit<{ message: string }, { message: string }>;
  onSubmit: (data: { message: string }) => void;
  showHints: boolean;
  messageValue: string;
  handleSelectCommand: (template: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;
  register: UseFormRegister<{ message: string }>;
  isPending?: boolean;
  filteredCommands: Command[];
}

const AiFotter = ({
  handleSubmit,
  onSubmit,
  showHints,
  messageValue,
  handleSelectCommand,
  highlightedIndex,
  setHighlightedIndex,
  register,
  isPending,
  filteredCommands,
}: AiFotterProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 👇 Auto-focus when AI finishes responding
  useEffect(() => {
    if (!isPending) {
      textareaRef.current?.focus();
    }
  }, [isPending]);

  return (
    <footer className="p-4 border-t border-gray-700">
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        {showHints && (
          <CommandHints
            inputValue={messageValue}
            onSelect={handleSelectCommand}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
          />
        )}
        <Textarea
          {...register("message")}
          ref={(el) => {
            // merge refs
            register("message").ref(el);
            textareaRef.current = el;
          }}
          placeholder="Ask anything or type '/' for commands... (Shift + Enter for new line)"
          autoComplete="off"
          rows={1}
          className="w-full max-h-40 bg-background border-gray-700 rounded-lg font-mono text-sm resize-none pr-12 py-3 custom-scrollbar"
          disabled={isPending}
          onFocus={() => {
            setTimeout(() => {
              textareaRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              });
            }, 300);
          }}
          onInput={(e) => {
            const textarea = e.currentTarget;
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (showHints) {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                  prev > 0 ? prev - 1 : filteredCommands.length - 1
                );
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                  prev < filteredCommands.length - 1 ? prev + 1 : 0
                );
              } else if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (highlightedIndex >= 0 && filteredCommands.length > 0) {
                  handleSelectCommand(
                    filteredCommands[highlightedIndex].template
                  );
                } else {
                  handleSubmit(onSubmit)();
                }
              }
            } else if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
        />

        <Button
          type="submit"
          disabled={isPending}
          size="icon"
          variant="ghost"
          className="absolute right-3 bottom-3 text-light-text hover:text-blue-400"
          aria-label="Send Message"
        >
          <FiSend />
        </Button>
      </form>
    </footer>
  );
};

export default AiFotter;
