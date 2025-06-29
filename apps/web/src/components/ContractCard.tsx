import { cn } from "../utils/classname-util";

export function ContractCard({
  name,
  description,
  selected,
  onClick,
  disabled,
}: {
  name: string;
  description: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left rounded-2xl p-4 border transition-all duration-200",
        disabled 
          ? "bg-white/5 cursor-not-allowed opacity-50" 
          : "bg-white/5 hover:bg-white/10 hover:cursor-pointer hover:border-white/30",
        selected ? "border-white ring-2 ring-white/30" : "border-white/10"
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-lg font-medium text-gray-100">
          {name}
        </span>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </button>
  );
}