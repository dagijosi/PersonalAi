export interface Command {
  name: string;
  description: string;
  template: string; // This will now be a user-friendly string
}

export const commands: Command[] = [
  {
    name: "navigate",
    description: "Navigate to a different page. Usage: /navigate <path>",
    template: "/navigate ",
  },
];
