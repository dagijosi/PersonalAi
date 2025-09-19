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
  modelName: 'gemini-pro' | 'gemini-pro-vision' |'gemini-2.5-flash'| 'gemini-2.5-flash-lite' = 'gemini-2.5-flash-lite' // Default to flash model
): Promise<string> => {
  console.log(`Fetching AI response for prompt: "${prompt}" using model: ${modelName}`);

  if (!prompt) {
    throw new Error('Prompt cannot be empty.');
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is not set. Please set it in the application settings.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelToUse = genAI.getGenerativeModel({ model: modelName });

  try {
    const result = await modelToUse.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error(`Error fetching AI response from Gemini API using ${modelName}:`, error);
    throw new Error(`Failed to get response from AI using ${modelName}. Please try again.`);
  }
};

export const testApiKey = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) return false;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    await model.generateContent("test");
    return true;
  } catch (error) {
    console.error("API key test failed:", error);
    return false;
  }
};

export const fetchAITags = async (content: string): Promise<string> => {
  if (!content) {
    throw new Error('Content cannot be empty for tag generation.');
  }

  const prompt = `Act as a tag generator. Based on the following content, provide 3-5 relevant, comma-separated tags. Do not include any other text or explanation, just the tags.\n\nContent: "${content}"\n\nTags:`;

  try {
    const tags = await fetchAIResponse(prompt);
    return tags.trim();
  } catch (error) {
    console.error("Error fetching AI tags:", error);
    throw new Error("Failed to generate tags from AI. Please try again.");
  }
};

export const fetchAISummary = async (content: string): Promise<string> => {
  if (!content) {
    return "No content to summarize.";
  }

  const prompt = `Provide only a concise paragraph summary of the following text, without using any markdown formatting (e.g., no bolding, italics, etc.) and without any introductory phrases:

${content}

Summary:`;

  try {
    const summary = await fetchAIResponse(prompt);
    return summary.trim();
  } catch (error) {
    console.error("Error fetching AI summary:", error);
    throw new Error("Failed to generate summary from AI. Please try again.");
  }
};

export const fetchAISuggestedTask = async (content: string): Promise<{ title: string; description?: string; priority: "low" | "medium" | "high" } | null> => {
  if (!content) {
    return null;
  }

  const prompt = `Analyze the following note content and suggest a single, actionable task. If a task is clearly implied, provide its title, a brief description, and a priority (low, medium, or high) in JSON format. If no clear task is implied, return null. Do not include any other text or explanation.\n\nNote Content: "${content}"\n\nJSON Task Suggestion:`;

  try {
    const aiResponse = await fetchAIResponse(prompt);
    const cleanedResponse = aiResponse.replace(/```json\n|```/g, '').trim(); // Clean up markdown code block
    if (cleanedResponse.toLowerCase() === 'null') {
      return null;
    }
    const suggestedTask = JSON.parse(cleanedResponse);
    // Basic validation
    if (suggestedTask && suggestedTask.title && suggestedTask.priority) {
      return suggestedTask;
    }
    return null;
  } catch (error) {
    console.error("Error fetching AI suggested task:", error);
    return null;
  }
};

export const fetchAISuggestedGroups = async (notes: { id: number; title: string; content: string; }[]): Promise<{ groupName: string; noteIds: number[] }[] | null> => {
  if (!notes || notes.length < 3) { // Need at least 3 notes to suggest a group
    return null;
  }

  const notesContent = notes.map(note => `ID: ${note.id}, Title: ${note.title}, Content: ${note.content}`).join('\n---\n');

  const prompt = `Analyze the following notes and identify if there are groups of 3 or more notes that share a common theme or topic. If you find such groups, suggest them in JSON format as an array of objects, where each object has a 'groupName' (e.g., 'Budget Notes', 'Project X Ideas') and 'noteIds' (an array of the IDs of notes belonging to that group). If no clear groups are found, return null. Do not include any other text or explanation.

Notes:
${notesContent}

JSON Group Suggestions:`;

  try {
    const aiResponse = await fetchAIResponse(prompt);
    const cleanedResponse = aiResponse.replace(/```json\n|```/g, '').trim();
    if (cleanedResponse.toLowerCase() === 'null') {
      return null;
    }
    const suggestedGroups = JSON.parse(cleanedResponse);
    if (Array.isArray(suggestedGroups)) {
      const validGroups = suggestedGroups.filter(group => group.groupName && Array.isArray(group.noteIds) && group.noteIds.length >= 3);
      if (validGroups.length > 0) {
        return validGroups;
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching AI suggested groups:", error);
    return null;
  }
};