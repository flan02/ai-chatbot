import Note from "@/components/Note";
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
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {
          allNotes.map((note) => (
            <Note note={note} key={note.id} />
          ))
        }
      </div>
      {
        allNotes.length === 0 && (

          <div className="col-span-full text-center text-2xl font-bold ">
            <p className="">No notes found</p>
          </div>

        )
      }
    </>

  )
}