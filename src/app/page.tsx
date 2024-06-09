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
  if (userId) redirect("/notes");

  return (
    <>
      <NavBar />
      <main className="flex  h-screen flex-col items-center justify-center gap-4">
        <Image src={logo} alt="FlowBrain logo" width={800} height={800} className="m-0 p-0" />
        <div className="flex items-center -mt-12 md:-mt-24">
          <span className="text-5xl font-extrabold tracking-tight lg:text-6xl text-amber-100">
            M&M MasterMind
          </span>
        </div>
        <p className="max-w-prose text-center text-amber-50">
          A clever note-taking app empowered by AI integration. Built with OpenAI,
          Pinecone, Vercel AI SDK, MongoDB, Prisma, Next.js, Shadcn UI, Clerk, Tailwindcss.
        </p>
        <Button size="lg" asChild>
          <Link href="/notes">Open</Link>
        </Button>
        <h6 className="text-xs text-muted-foreground">created by Dan Chanivet</h6>

      </main>
    </>
  );
}