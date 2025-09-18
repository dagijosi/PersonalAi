import type { ToolCall } from "../utils/commandParser";
import type { NavigateFunction } from "react-router-dom";

export const handleToolCall = async (
  toolCall?: ToolCall,
  navigate?: NavigateFunction
) => {
  if (!toolCall) {
    return "No tool call provided.";
  }

  switch (toolCall.tool) {
    case "navigate": {
      if (!navigate) return "Navigate function is missing.";
      const path = (toolCall.args as { path: string }).path;
      setTimeout(() => navigate(path), 100);
      return `Navigating to ${path}...`;
    }
    default:
      return `Error: Unrecognized tool: ${toolCall.tool}`;
  }
};
