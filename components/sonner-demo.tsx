"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";

export default function SonnerDemo() {
  return (
    <Button
      onClick={() => 
        toast("Event has been created", {
          description: new Date().toLocaleString(),
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  );
}
