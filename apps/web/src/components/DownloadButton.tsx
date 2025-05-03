import { cn } from "../utils/classname-util";

export function DownloadButton({
  text,
  fileName,
  label,
  className,
}: {
  text: string;
  fileName: string;
  label: string;
  className: string;
}) {
  return (
    <button
      onClick={() => {
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }}
      className={cn(
        "px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors",
        className
      )}
    >
      {label}
    </button>
  );
}
