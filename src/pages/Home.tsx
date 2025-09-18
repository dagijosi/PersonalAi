import { useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useForm, useWatch } from "react-hook-form";
import { commands } from "../data/commands";
import { useAIMutation } from "../queries/useAIMutation";
import { FiCpu, FiTrash2 } from "react-icons/fi";
import { Select } from "../common/ui/Select";
import { Button } from "../common/ui/Button";
import ChatArea from "../components/ChatArea";
import AiFotter from "../components/AiFotter";


const Home = () => {
  // Auto-detect if text looks like research
  const { messages, addMessage, clearMessages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedModel, setSelectedModel] = useState<
    | "gemini-pro"
    | "gemini-pro-vision"
    | "gemini-2.5-flash"
    | "gemini-2.5-flash-lite"
  >("gemini-2.5-flash");
  const [optionsAreLoading, setOptionsAreLoading] = useState(true);
  const { register, handleSubmit, reset, setFocus, control, setValue } =
    useForm<{
      // Added control and setValue
      message: string;
    }>({
      defaultValues: { message: "" },
    });

  const messageValue = useWatch({ control, name: "message" }); // Watch the input value

  const [showHints, setShowHints] = useState(false); // New state for hints
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // New state for keyboard navigation

  const filteredCommands = useMemo(() => {
    if (!messageValue || !messageValue.startsWith("/")) return [];
    const query = messageValue.substring(1).toLowerCase();
    return commands.filter((cmd) => cmd.name.toLowerCase().includes(query));
  }, [messageValue]);

  const { mutate, isPending } = useAIMutation(selectedModel);

  const onSubmit = (data: { message: string }) => {
    if (!data.message.trim()) return;
    addMessage({ text: data.message, sender: "user" });
    mutate(data.message);
    reset();
  };

  // Handler for selecting a command from the hint menu
  const handleSelectCommand = (template: string) => {
    setValue("message", template);
    setShowHints(false);
    setHighlightedIndex(-1); // Reset highlighted index
    setTimeout(() => setFocus("message"), 50); // Focus after state update
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setOptionsAreLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => setFocus("message"), [setFocus]);

  // Effect to show/hide command hints based on input
  useEffect(() => {
    if (messageValue && messageValue.startsWith("/")) {
      setShowHints(true);
    } else {
      setShowHints(false);
    }
  }, [messageValue]);

  useEffect(() => {
    if (!showHints) {
      setHighlightedIndex(-1);
    }
  }, [showHints]);

  return (
    <div className="px-4 lg:px-8 h-[calc(100vh-4rem)] pt-4 bg-background text-primary">
      <div>
        {/* Header */}
        <header className="flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <FiCpu className="text-blue-400" />
            <span className="font-semibold text-primary">AI Assistant</span>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={selectedModel}
              onChange={(e) =>
                setSelectedModel(
                  e.target.value as
                    | "gemini-pro"
                    | "gemini-pro-vision"
                    | "gemini-2.5-flash"
                    | "gemini-2.5-flash-lite"
                )
              }
              icon={<FiCpu />}
              optionsLoading={optionsAreLoading}
              loadingOptionText="Loading Models..."
              className="bg-background border-gray-600 text-primary text-xs hover:text-primary rounded-md"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-2.5-flash-lite">
                Gemini 2.5 Flash Lite
              </option>
              <option value="gemini-pro">Gemini Pro</option>
              <option value="gemini-pro-vision">Gemini Pro Vision</option>
            </Select>
            <Button
              type="button"
              onClick={clearMessages}
              variant="ghost"
              size="icon"
              className="text-light-text hover:text-white hover:bg-primary"
              aria-label="Clear Chat"
            >
              <FiTrash2 />
            </Button>
          </div>
        </header>
        <ChatArea 
          messages={messages}
          isPending={isPending}
          messagesEndRef={messagesEndRef}
        />
        <AiFotter 
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          showHints={showHints}
          messageValue={messageValue}
          handleSelectCommand={handleSelectCommand}
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          register={register}
          isPending={isPending}
          filteredCommands={filteredCommands}
        />
      </div>
    </div>
  );
};

export default Home;
