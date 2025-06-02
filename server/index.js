// index.js
import express from "express";
import cors from "cors";
import generate from "./generate.js";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

// Simple health‐check route
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

// Helper to sleep for a given number of milliseconds:
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Wrap generate() in a retry loop for 429 (rate‐limit) errors:
async function generateWithRetry(queryDescription, retries = 2) {
  try {
    return await generate(queryDescription);
  } catch (err) {
    const status = err.response?.status;
    const errorBody = err.response?.data;

    console.error("⚠️ OpenAI returned status:", status);
    console.error("⚠️ OpenAI error body:", JSON.stringify(errorBody));

    // If we got a 429 from OpenAI, retry after a short delay
    if (status === 429 && retries > 0) {
      console.warn(`⏳ Rate‐limit hit. Retrying in 1s… (retries left: ${retries - 1})`);
      await delay(1000);
      return generateWithRetry(queryDescription, retries - 1);
    }

    // Otherwise, rethrow so the outer handler can respond with 500
    throw err;
  }
}

app.post("/generate", async (req, res) => {
  const queryDescription = req.body?.queryDescription;
  if (!queryDescription) {
    return res.status(400).json({ error: "queryDescription is required" });
  }

  try {
    const sqlQuery = await generateWithRetry(queryDescription);
    return res.json({ response: sqlQuery });
  } catch (error) {
    // If we’ve exhausted retries or got a non‐429, send the exact OpenAI error body back
    const status = error.response?.status || 500;
    const body = error.response?.data || { message: error.message };

    console.error("❌ Final error in /generate:", body);
    return res.status(status).json(body);
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
