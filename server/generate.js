// generate.js
import openaiClient from "./api.js";

const generate = async (queryDescription) => {
  if (!queryDescription || typeof queryDescription !== "string") {
    throw new Error("generate() requires a non‐empty string as queryDescription");
  }

  // Build the chat‐style payload
  const response = await openaiClient.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `
You are a SQL generator. When given a natural‐language description, you must output exactly the SQL query—nothing else. 
Do not include any explanatory text, no "Sure" or "Here is the query" phrases, and no markdown/code fences. 
Output only the raw SQL statement, terminated by a semicolon if appropriate.
        `
      },
      {
        role: "user",
        content: `Convert this into a SQL query (only the SQL—no extra text):\n\n${queryDescription}.`,
      },
    ],
    max_tokens: 100,
    temperature: 0,
  });

  // Grab the assistant’s reply text
  const chatMsg = response.data.choices[0].message.content;
  return chatMsg.trim();
};

export default generate;
