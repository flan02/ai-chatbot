import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { createNoteSchema, deleteNoteSchema, updateNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: parseResult.error }, { status: 400 });
    }
    const { title, content } = parseResult.data;
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate embedding for note before saving in ddbb.
    const embedding = await getEmbeddingForNote(title, content);

    // Store embedding in pinecode ddbb so we can later search for it.
    // * Always first executing mongodb operation, then execute pinecone operation.
    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        }
      });

      await notesIndex.upsert([
        { // insert entry in pinecone ddbb
          id: note.id,
          values: embedding,
          metadata: { userId }
        }
      ])

      return note
    })

    return Response.json({ note }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = updateNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: parseResult.error }, { status: 400 });
    }
    const { id, title, content } = parseResult.data; // * Prisma requires destructure the data
    const noteFound = await prisma.note.findUnique({ where: { id } });
    if (!noteFound) {
      return Response.json({ error: 'Note not found' }, { status: 404 });
    }
    const { userId } = auth();
    if (!userId || userId !== noteFound.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Save note to database
    const updatedNote = await prisma.note.update({
      where: {
        id
      },
      data: {
        title,
        content
      }
    });
    return Response.json({ updatedNote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deleteNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: parseResult.error }, { status: 400 });
    }
    const note = parseResult.data;
    const noteFound = await prisma.note.findUnique({ where: { id: note.id } });
    const { userId } = auth();
    if (!noteFound) {
      return Response.json({ error: 'Note not found' }, { status: 404 });
    }
    if (!userId || userId !== noteFound.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Save note to database
    const deletedNote = await prisma.note.delete({ where: { id: note.id } });
    return Response.json({ message: "Noted deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}


async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "")
}


/*
? Prisma way -> Save note to database (POST)
const newNote = await prisma.note.create({
  data: {
    title,
    content,
    userId
  }
});

return Response.json({ newNote }, { status: 201 });
*/