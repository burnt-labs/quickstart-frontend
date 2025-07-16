import { useState } from "react";

interface CodeDisplayProps {
  code: string;
  language?: string;
}

export function CodeDisplay({ code, language = "typescript" }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}