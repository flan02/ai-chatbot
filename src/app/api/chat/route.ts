import { notesIndex } from "@/lib/db/pinecone"
import prisma from "@/lib/db/prisma"
import { getEmbedding } from "@/lib/openai"
import { auth } from "@clerk/nextjs/server"
import { ChatCompletionMessage } from "openai/resources/index.mjs"

export async function POST(req: Request) {
  try {
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
      topK: 1,
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

    const systemMessages = relevantNotes.map((note) => ({
      role: "system", // * assistant, function, system, user (different roles for the chatbot)
      content: "You are an intelligent note-taking app. You answer the user's based pm tjeor existint notes. " +
        "The relevant notes for this query are: \n " +
        relevantNotes
          .map((note) => `Title: ${note.title}`)
          .join(`\n\nContent:\n${note.content}\n\n`)
    }))

    return Response.json({ notes: vectorQueryResponse.matches }, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}