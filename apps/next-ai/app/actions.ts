"use server";

import { streamText } from "ai";
import { createMistral } from "@ai-sdk/mistral";
import { createStreamableValue } from "@ai-sdk/rsc";

const mistral = createMistral({ apiKey: process.env.AI_MISTRAL_API_KEY! });

export async function generateAnswer(question: string) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = streamText({
      model: mistral("mistral-large-latest"),
      prompt: question,
    });

    for await (const chunk of textStream) {
      stream.update(chunk);
    }

    stream.done();
  })();

  return { output: stream.value };
}
