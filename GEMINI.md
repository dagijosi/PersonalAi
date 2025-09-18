# Personal AI Workspace (MVP)

This project is a minimal viable product for a personal AI workspace. It is designed to be used with the Gemini API.

## Getting Started

To get started, you will need to have a Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

Once you have your API key, you can add it to the application by navigating to the settings page and entering your key.

## Tailwind Styling

The project uses Tailwind CSS for styling. The following is the content of `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Jost:wght@300;400;500;600;700&family=Inter:wght@400;500;700&family=Fira+Code:wght@400;500&display=swap');

@import "tailwindcss";

@theme {
    --font-sans: 'Inter', 'Poppins', 'Jost', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --font-mono: 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --color-primary: #133356;
    --color-destructive: #ef4444;
    --color-destructive-foreground: #ffffff;
    --color-secondary: #f1f5f9;
    --color-secondary-foreground: #0f172a;
    --color-accent: #f1f5f9;
    --color-accent-foreground: #0f172a;
    --color-primary-foreground: #ffffff;
    --color-background: #ffffff;
    --color-input: #e5e7eb;
    --color-ring: #3b82f6;
}

@layer utilities {
    .font-poppins {
        font-family: 'Poppins', sans-serif;
      }
    
      .font-jost {
        font-family: 'Jost', sans-serif;
      }
      
    .scrollbar-hidden {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .scrollbar-hidden::-webkit-scrollbar {
        display: none;
    }

    .custom-scrollbar {
        &::-webkit-scrollbar {
            width: 0;
        }

        &:hover::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-thumb {
            background: #4b5563; /* Darker scrollbar for dark theme */
            border-radius: 10px;
        }

    }
    .custom-scrollbarX {
        &:hover::-webkit-scrollbar {
            height: 8px;
        }

        &::-webkit-scrollbar {
            height: 0;
        }

        &::-webkit-scrollbar-thumb {
            background: #4b5563; /* Darker scrollbar for dark theme */
            border-radius: 10px;
        }
    }
}
```

## Project Structure

### `src/api`

This directory contains the API layer of the application. It is responsible for making requests to the Gemini API.

**`ai.ts`**

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

// Function to get the API key from local storage
export const getApiKey = (): string | null => {
  return localStorage.getItem('gemini-api-key');
};

// Function to set the API key in local storage
export const setApiKey = (apiKey: string): void => {
  localStorage.setItem('gemini-api-key', apiKey);
};

export const fetchAIResponse = async (
  prompt: string,
  modelName: 'gemini-pro' | 'gemini-pro-vision' | 'gemini-1.5-flash' = 'gemini-1.5-flash' // Default to flash model
): Promise<string> => {
  // ...
};
```

### `src/common/ui`

This directory contains common UI components that are used throughout the application.

**`Button.tsx`**

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"
import { motion, type MotionProps } from "framer-motion"


import { buttonVariants } from "./button-variants"
import { cn } from "../../utils/cn"

// ...

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & MotionProps>(
  ({ className, variant, size, asChild = false, isLoading = false, loadingIcon, children, disableAnimation = false, ...props }, ref) => {
    // ...
  }
)
```

**`Input.tsx`**

```tsx
import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { inputVariants } from "./input-variants";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

// ...

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        { className, variant, inputSize, icon, iconPosition = "left", label, labelClassName, iconWrapperClassName, error, errorClassName, description, descriptionClassName, required, labelStyle = "default", placeholder, onFocus, onBlur, onChange, ...props },
        ref
    ) => {
        // ...
    }
);
```

**`Select.tsx`**

```tsx
import { FiChevronDown } from "react-icons/fi";
import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { motion, type MotionProps } from "framer-motion";

import { cn } from "../../utils/cn";
import { selectVariants } from "./select-variants";

// ...

const Select = React.forwardRef<HTMLSelectElement, SelectProps & MotionProps>(
  ({ className, variant, size, isLoading = false, loadingIcon, optionsLoading = false, loadingOptionText = "Loading options...", icon, iconPosition = "left", iconWrapperClassName, dropdownIcon = <FiChevronDown />, dropdownIconWrapperClassName, children, ...props }, ref) => {
    // ...
  }
);
```

**`Textarea.tsx`**

```tsx
import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { textareaVariants } from "./textarea-variants";
import { motion } from "framer-motion";

// ...

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        { className, variant, label, labelClassName, error, errorClassName, description, descriptionClassName, required, ...props },
        ref
    ) => {
        // ...
    }
);
```

### `src/components`

This directory is intended for general components, but it is currently empty.

### `src/data`

This directory contains mock data for the application.

**`Note.ts`**

```typescript
import type { Note } from "../types/NoteType";

export const demoNotes: Note[] = [
  // ...
];
```

**`Task.ts`**

```typescript
import type { Task } from "../types/TaskType";

export const demoTasks: Task[] = [
  // ...
];
```

### `src/queries`

This directory contains TanStack Query hooks for fetching data.

**`ai.ts`**

```typescript
import { useQuery } from "@tanstack/react-query";
import { fetchAIResponse } from "../api/ai";

export const useAIResponse = (prompt: string) => {
  return useQuery({
    queryKey: ["ai-response", prompt],
    queryFn: () => fetchAIResponse(prompt),
    enabled: !!prompt, // Only run the query if the prompt is not empty
  });
};
```

### `src/types`

This directory contains TypeScript type definitions.

**`AppType.ts`**

```typescript
import type { ComponentType } from "react";

export interface RouteMeta {
  [key: string]: unknown;
}

export interface AppRoute {
  path?: string;
  Component?: ComponentType;
  index?: boolean;
  children?: AppRoute[];
  meta?: RouteMeta;
}
```

**`NoteType.ts`**

```typescript
export type Note = {
  id: number;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
};
```

**`TaskType.ts`**

```typescript
export type Task = {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  createdAt: string;
};
```

### `src/utils`

This directory contains utility functions.

**`cn.ts`**

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**`ErrorPage.tsx`**

```tsx
import React from 'react';
import { BiError } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  // ...
};

export default ErrorPage;
```

**`RequireAuth.tsx`**

```tsx
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../router/routes";
import { getAccessToken, isAccessTokenValid } from "./token";

// ...

const RequireAuth = ({ children }: RequireAuthProps) => {
  // ...
};

export default RequireAuth;
```

**`token.ts`**

```typescript
export function isAccessTokenValid(token: string | null): boolean {
    // ...
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
  // ...
}

export function getAccessToken() {
  // ...
}

export function getRefreshToken() {
  // ...
}

export function clearAuthTokens() {
  // ...
}
```