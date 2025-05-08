import { cn } from "../utils/classname-util";

export function FrameworkCard({
  name,
  description,
  selected,
  onClick,
  templateUrl,
}: {
  name: string;
  description: string;
  selected?: boolean;
  onClick: () => void;
  templateUrl: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl p-4 border transition-all duration-200",
        "bg-white/5 hover:bg-white/10 hover:cursor-pointer",
        "hover:border-white/30",
        selected ? "border-white ring-2 ring-white/30" : "border-white/10"
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-lg font-medium text-gray-100">{name}</span>
      </div>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <a
        href={templateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-white/80 hover:underline inline-flex items-center gap-1"
      >
        View template →
      </a>
    </button>
  );
}
