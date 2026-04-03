import { generateText } from "ai";
import { createMistral } from "@ai-sdk/mistral";

const mistral = createMistral({
  apiKey: process.env.AI_MISTRAL_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = body.prompt;

    const result = await generateText({
      model: mistral("mistral-large-latest"),
      prompt: prompt,
    });

    return Response.json({ text: result.text });
  } catch (error) {
    console.error("Erreur de génération:", error);
    return new Response(JSON.stringify({ error: "Erreur interne" }), {
      status: 500,
    });
  }
}
