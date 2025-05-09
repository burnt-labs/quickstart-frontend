import { useState } from "react";
import { cn } from "../utils/classname-util";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }}
      className={cn(
        "px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors",
        className
      )}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
