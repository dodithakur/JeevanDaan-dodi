import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// Serve static files from the 'practice' folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// Gemini endpoint
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY 
});

app.post("/gemini", async (req, res) => {
  let prompt = req.body.prompt;
  const response = await main(prompt);
  res.send(response);
});

async function main(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  return response.candidates[0].content.parts[0].text;
}

// Listen on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});