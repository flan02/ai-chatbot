import NavBar from "@/components/NavBar";
import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Chatbox - Sign In',
  description: 'Sign in to Chatbox',
}

export default function SignInPage() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col h-auto space-y-5 items-center justify-center">
        <h1 className="text-4xl mt-12 text-amber-300 font-bold">Welcome Guest!</h1>
        <br />
        <SignIn appearance={{ variables: { colorPrimary: "#0F172A", colorBackground: "#ffde00" } }} />
      </div>
    </>
  )
}