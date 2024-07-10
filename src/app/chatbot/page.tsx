

import { auth } from "@clerk/nextjs/server"
import { Metadata } from "next"
import Image from "next/image"
import ChatbotClientComponent from "./ChatbotClientComponent"

export const metadata: Metadata = {
  title: 'Chatbox - EIAI',
  description: 'Chatbot trained with OpenAI GPT-4 models as assistant.',
}

type Props = {}

export default async function ChatbotPage() {
  const { userId } = auth();
  if (!userId) throw Error('userId undefined')
  return (
    <main>

      <article className="mx-auto flex max-w-5xl h-[20vh] justify-center items-center content-center">
        <div className="flex-grow-2">
          <Image src="/yo.jpg" alt="yo" className="rounded-full" width={200} height={200} />
        </div>
        <div className="flex-grow-1">
          <h1 className="text-slate-400 dark:text-amber-300 text-md md:text-lg lg:text-2xl w-fit pl-4">
            &nbsp; Welcome my name is Dan Chanivet this is my personal website. Unfortunately I&apos;m not available right now, but you can ask my assistant some questions about my profile background.
          </h1>
        </div>
      </article>
      <section className="flex justify-center -mt-4">
        <ChatbotClientComponent />
      </section>
    </main>
  )
}

