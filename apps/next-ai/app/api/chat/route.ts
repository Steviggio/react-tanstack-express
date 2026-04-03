import { streamText, convertToModelMessages, UIMessage } from "ai";
import { createMistral } from "@ai-sdk/mistral";

const mistral = createMistral({
  apiKey: process.env.AI_MISTRAL_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: mistral("mistral-large-latest"),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Erreur serveur:", error);
    return Response.json(
      { error: "Erreur lors du traitement de la requête." },
      { status: 500 },
    );
  }
}
