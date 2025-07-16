import { BaseCard } from "../BaseCard";

interface DeploymentModeCardProps {
  deploymentMode: 'template' | 'custom' | null;
  onModeChange: (mode: 'template' | 'custom') => void;
  completed: boolean;
  expanded: boolean;
  onContinue: () => void;
  onEdit: () => void;
}

export function DeploymentModeCard({
  deploymentMode,
  onModeChange,
  completed,
  expanded,
  onContinue,
  onEdit
}: DeploymentModeCardProps) {
  const handleContinue = () => {
    if (deploymentMode) {
      onContinue();
    }
  };

  return (
    <BaseCard
      title="Choose Deployment Mode"
      description="Template or custom implementation"
      completed={completed}
      expanded={expanded}
      onEdit={onEdit}
    >
      <div className="space-y-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onModeChange('template')}
            className={`
              relative p-6 rounded-lg border-2 text-center transition-all
              ${
                deploymentMode === 'template'
                  ? "border-white/40 bg-[#2A2A2A]"
                  : "border-white/20 hover:border-white/30 bg-transparent"
              }
            `}
          >
            <div className="flex flex-col items-center">
              {/* Lightning Icon */}
              <svg
                className={`w-6 h-6 mb-3 ${deploymentMode === 'template' ? 'text-primary' : 'text-white/80'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              
              <div className="text-center">
                <h3 className="font-semibold text-base leading-6">
                  Template
                </h3>
                <p className="text-sm leading-5 text-grey-text mt-1">
                  Re-use an Existing Contract
                </p>
              </div>
            </div>
            
            {deploymentMode === 'template' && (
              <div className="absolute top-3 right-3">
                <svg
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>

          <button
            onClick={() => onModeChange('custom')}
            className={`
              relative p-6 rounded-lg border-2 text-center transition-all
              ${
                deploymentMode === 'custom'
                  ? "border-white/40 bg-[#2A2A2A]"
                  : "border-white/20 hover:border-white/30 bg-transparent"
              }
            `}
          >
            <div className="flex flex-col items-center">
              {/* Code Icon */}
              <svg
                className={`w-6 h-6 mb-3 ${deploymentMode === 'custom' ? 'text-primary' : 'text-white/80'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              
              <div className="text-center">
                <h3 className="font-semibold text-base leading-6">
                  Custom
                </h3>
                <p className="text-sm leading-5 text-grey-text mt-1">
                  Upload a WASM Binary
                </p>
              </div>
            </div>
            
            {deploymentMode === 'custom' && (
              <div className="absolute top-3 right-3">
                <svg
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        </div>

        {deploymentMode && (
          <button
            onClick={handleContinue}
            className="w-full py-3 px-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
          >
            Continue
          </button>
        )}
      </div>
    </BaseCard>
  );
}