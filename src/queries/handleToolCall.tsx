import routes from "../router/routes";
import type { AppRoute } from "../types/AppType";
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
// Flatten routes recursively to check if the path exists
      const allPaths = flattenRoutes(routes);
      const exists = allPaths.includes(path);

      if (exists) {
        if (!navigate) return "Navigate function is missing.";
        navigate(path); // Real navigation
        return `Navigated to ${path}`;
      } else {
        return `No route found for "${path}"`; // 👈 simple message instead of virtual navigation
      }
    }
    default:
      return `Error: Unrecognized tool: ${toolCall.tool}`;
  }
};
function flattenRoutes(routes: AppRoute[]): string[] {
  return routes.flatMap(r => [
    ...(r.path ? [r.path] : []),
    ...(r.children ? flattenRoutes(r.children) : [])
  ]);
}
