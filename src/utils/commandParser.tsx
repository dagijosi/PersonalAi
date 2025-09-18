type ToolName =
  | "navigate"
  | "addNote";

  type ToolArgs =
  | { path: string }
  | { title: string; content: string; tags: string[] };

export interface ToolCall {
  tool: ToolName;
  args: ToolArgs;
}

export const parseUserCommand = (userPrompt: string): ToolCall | null => {
  userPrompt = userPrompt.trim();

  if (!userPrompt.startsWith("/")) return null;

  const parts = userPrompt
    .split(" ")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const command = parts[0];
    switch (command) {
    case "/navigate": {
      let path = parts[1];
      if (!path) return null;
      if (!path.startsWith("/")) path = "/" + path; // make absolute
      return { tool: "navigate", args: { path } };
    }
     default:
      return null;
  }
}