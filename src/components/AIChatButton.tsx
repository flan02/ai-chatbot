import { Bot } from "lucide-react";
import { useState } from "react";
import AIChatBox from "./AIChatBot";
import { Button } from "./ui/button";

export default function AIChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  // original name was AI Chat. I changed it to AI jr. because it's a junior AI
  return (
    <>
      <Button onClick={() => setChatBoxOpen(true)}>
        <Bot size={20} className="mr-2" />
        EIAI
      </Button>
      <AIChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
}