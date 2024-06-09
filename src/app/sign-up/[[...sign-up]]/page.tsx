import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chatbox - Sign Up",
  description: 'Sign up to Chatbox',
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp appearance={{ variables: { colorPrimary: "#0F172A" } }} />
    </div>
  )
}