import logo from "@/assets/mastermind-removebg-preview.png"
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "M&M MasterMind | Home",
  description: "A clever note-taking app with OpenAI",
};


export default function Home() {
  const userId = auth().userId;
  console.log(userId);
  if (userId) redirect("/chatbot");

  return (
    <>
      <NavBar />
      <main className="flex flex-col items-center justify-center gap-4 mt-24">
        <Image src={logo} alt="FlowBrain logo" width={800} height={800} className="m-0 p-0 " />
        <div className="flex items-center -mt-12 md:-mt-24">
          <span className="text-5xl font-extrabold tracking-tight lg:text-6xl text-amber-300">
            M&M MasterMind
          </span>
        </div>
        <p className="max-w-prose text-left text-slate-600 px-4">
          This project allows users to create their own chatbot trained as an assistant with OpenAI GPT-4 models.
        </p>
        <br />
        <Button size="lg" asChild>
          <Link href="/chatbot">Open</Link>
        </Button>
        <br />
        <h6 className="text-sm text-slate-400 text-muted-foreground px-4">Built with OpenAI, Langchain, Langsmith, Pinecone, Vercel AI SDK, MongoDB, Prisma, Next.js, Shadcn UI, Clerk, Tailwindcss.</h6>
        <h6 className="text-xs text-muted-foreground">created by Dan Chanivet</h6>

      </main>
    </>
  );
}