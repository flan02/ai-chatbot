import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Chatbox - Notes',
  description: 'Notes page powered by AI',
}

type Props = {}

export default async function NotesPage() {
  const { userId } = auth();
  if (!userId) throw Error('userId undefined')
  const allNotes = await prisma.note.findMany({
    where: {
      userId
    }
  })

  return (
    <div>
      {JSON.stringify(allNotes)}
    </div>
  )
}