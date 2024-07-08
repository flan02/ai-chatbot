import { notesIndex } from "@/lib/db/pinecone"
import prisma from "@/lib/db/prisma"

// * https://sdk.vercel.ai/providers/ai-sdk-providers/openai
//import { createOpenAI, openai } from '@ai-sdk/openai';
import openai, { getEmbedding } from "@/lib/openai"
import { OpenAIStream, StreamingTextResponse } from "ai"

import { auth } from "@clerk/nextjs/server"
import { ChatCompletionMessage } from "openai/resources/index.mjs"

export async function POST(req: Request) {
  try {
    // throw new Error("Artificial error for testing purposes")
    const body = await req.json()
    const messages: ChatCompletionMessage[] = body.messages
    // Only retrieve the last 6 messages to avoid sending too much data and save my tokens usage in OpenAI API
    const messagesTruncated = messages.slice(-6) // ? it contains user messages and AI answers
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n") // add a line break between each message
    )
    const { userId } = auth()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Store embedding in pinecode ddbb so we can later search for it.
    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 6, // ? How many notes the AI will be capable to read
      filter: { userId }
    })

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id)
        }
      }
    })

    console.log("Relevant notes found: ", relevantNotes)

    const systemMessage: ChatCompletionMessage = {
      role: "assistant", // * assistant, function, system, user (different roles for the chatbot) 
      content: "You are an intelligent note-taking app. You answer the user's based pm tjeor existint notes. " +
        "The relevant notes for this query are: \n " +
        relevantNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join(`\n\n`)
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 }) // ?  Vercel AI SDK manage 500 responses as a error
  }
}