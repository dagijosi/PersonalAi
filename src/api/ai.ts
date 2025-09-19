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