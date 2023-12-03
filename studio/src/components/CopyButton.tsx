"use client";
import { CopyCheck, CopyIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  text: string;
  className?: string;
};

const CopyButton = ({ text, className }: CopyButtonProps) => {
  const [clicked, setClicked] = useState(false);
  return (
    <Button
      className={cn(className, "w-10 h-10 p-0")}
      variant="outline"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setClicked(true);
        setTimeout(() => setClicked(false), 1000);
      }}
    >
      {clicked ? (
        <CopyCheck className="w-4 h-4" />
      ) : (
        <CopyIcon className="w-4 h-4" />
      )}
    </Button>
  );
};

export default CopyButton;
