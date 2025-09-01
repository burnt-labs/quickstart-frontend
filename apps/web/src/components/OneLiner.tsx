import CopyButton from "./CopyButton";

interface OneLinerProps {
  url: string;
  onTrack?: (action: string) => void;
}

export function OneLiner({ url, onTrack }: OneLinerProps) {
  return (
    <div className="flex bg-white/5 rounded-lg p-4 gap-2">
      <div className="text-white/50 flex-shrink-0">$</div>
      <div className="overflow-x-auto whitespace-nowrap">
        /bin/bash -c "$(curl -fsSL {url})"
      </div>
      <div className="flex-shrink-0 border-l border-white/10 pl-2">
        <CopyButton 
          text={`/bin/bash -c "$(curl -fsSL '${url}')"`} 
          onCopy={() => onTrack?.('step_4_installer_copied')}
        />
      </div>
    </div>
  );
}
