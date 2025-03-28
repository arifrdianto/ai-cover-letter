"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { PartyPopper } from "lucide-react";

export default function LinkedinConnect() {
  return (
    <div className="flex flex-row border border-dashed border-gray-200 rounded-lg p-3">
      <PartyPopper className="h-12 w-12 p-2" strokeWidth={1} />
      <div className="flex flex-col flex-1">
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-col">
            <h3 className="font-medium text-sm">Autofill form</h3>
            <p className="text-xs text-muted-foreground">
              Save your time by connecting your LinkedIn profile. (Coming soon!)
            </p>
          </div>
          <Button
            onClick={async () => {
              signIn("linkedin", {
                callbackUrl: "/",
              });
            }}
            size="sm"
            className="bg-[#0a66c2] hover:bg-[#004182] text-white border-none rounded-full"
          >
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
}
