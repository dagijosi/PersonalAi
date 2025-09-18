import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useMutation } from "@tanstack/react-query";
import { parseUserCommand, type ToolCall } from "../utils/commandParser";
import { fetchAIResponse } from "../api/ai";
import { getSystemPrompt } from "./getSystemPrompt";
import { handleToolCall } from "./handleToolCall";

export const useAIMutation = (
  modelName:
    | "gemini-pro"
    | "gemini-pro-vision"
    | "gemini-2.5-flash"
    | "gemini-2.5-flash-lite" = "gemini-2.5-flash"
) => {
  const { addMessage, messages } = useChatStore(); // Get messages from store
  const navigate = useNavigate();
  return useMutation<string, Error, string>({
    mutationFn: async (prompt: string) => {
      const parsedToolCall = parseUserCommand(prompt);
      handleToolCall(undefined,navigate);
      if (parsedToolCall) {
        return handleToolCall(parsedToolCall);
      }

      // ---------------------- AI Response ----------------------
      const messageHistory = messages
        .slice(-5)
        .map((msg) => `${msg.sender === "user" ? "User" : "AI"}: ${msg.text}`)
        .join("\n");
      const fullPrompt = `${getSystemPrompt()}\n\n--- Conversation History ---\n${messageHistory}\n\nUser query: "${prompt}"`;
      const aiResponse = await fetchAIResponse(fullPrompt, modelName);

      try {
        const sanitized = aiResponse.replace(/```json\n|```/g, "").trim();
        const toolCall: ToolCall = JSON.parse(sanitized);
        return handleToolCall(toolCall);
      } catch {
        return aiResponse; // Regular response, not a tool call
      }
    },
    onSuccess: (data) => addMessage({ text: data, sender: "ai" }),
    onError: (error) =>
      addMessage({ text: `Error: ${error.message}`, sender: "ai" }),
  });
};
