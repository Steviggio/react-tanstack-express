import express from "express";
import type { Request, Response } from "express";
import { Mistral } from "@mistralai/mistralai";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const apiKey = process.env.AI_MISTRAL_API_KEY;

if (!apiKey) {
  throw new Error("AI_MISTRAL_API_KEY environment variable is required.");
}

const client = new Mistral({ apiKey });

interface IncomingMessage {
  role: "user" | "assistant" | "system";
  content?: string;
  parts?: Array<{ type: string; text: string }>;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = req.body.messages as unknown;

    if (!Array.isArray(messages)) {
      res
        .status(400)
        .json({ error: "Invalid payload: messages must be an array." });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const formattedMessages = messages.map((m: IncomingMessage) => {
      let textContent = "";

      if (typeof m.content === "string") {
        textContent = m.content;
      } else if (Array.isArray(m.parts)) {
        textContent = m.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("");
      }

      return {
        role: m.role,
        content: textContent || " ",
      };
    });

    const systemPrompt = {
      role: "system" as const,
      content:
        "You are a language specialist. You are an expert in explaining complex language concepts in simple terms. You have a friendly and approachable tone, and you enjoy engaging with students. Your goal is to help students understand language concepts clearly and effectively.",
    };

    const result = await client.chat.stream({
      model: "mistral-large-latest",
      messages: [systemPrompt, ...formattedMessages],
    });

    for await (const chunk of result) {
      const streamText = chunk.data.choices[0]?.delta.content;
      if (typeof streamText === "string" && streamText.length > 0) {
        res.write(`data: ${JSON.stringify({ text: streamText })}\n\n`);
      }
    }

    res.end();
  } catch (error: unknown) {
    console.error("Error processing chat request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "An error occurred while processing the chat request.",
      });
    } else {
      res.end();
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
