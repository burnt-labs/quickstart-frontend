import { FRONTEND_TEMPLATES, type FrontendTemplate } from "../config/constants";
import { Card, CardHeader, CardTitle, CardDescription } from './ui/Card';

interface DeploymentSectionProps {
  isReady: boolean;
  isPending: boolean;
  frontendTemplate: FrontendTemplate;
  onDeploy: () => void;
  onTemplateChange: (template: FrontendTemplate) => void;
}

const templateInfo = {
  [FRONTEND_TEMPLATES.REACT]: {
    title: "React",
    description: "Modern React app with hooks",
  },
  [FRONTEND_TEMPLATES.VUE]: {
    title: "Vue.js",
    description: "Vue 3 with Composition API",
  },
  [FRONTEND_TEMPLATES.NEXTJS]: {
    title: "Next.js",
    description: "Full-stack React framework",
  },
  [FRONTEND_TEMPLATES.VANILLA]: {
    title: "Vanilla JS",
    description: "Plain JavaScript, no framework",
  },
};

export function DeploymentSection({
  isReady,
  isPending,
  frontendTemplate,
  onDeploy,
  onTemplateChange,
}: DeploymentSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Options</CardTitle>
      </CardHeader>

      <div className="space-y-6">
        {/* Frontend Template Selection */}
        <div>
          <h3 className="text-sm font-medium text-white mb-3">
            Frontend Template
          </h3>
          <p className="text-sm text-grey-text mb-4">
            Choose a template for the generated integration code
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(templateInfo).map(([template, info]) => (
              <button
                key={template}
                onClick={() => onTemplateChange(template as FrontendTemplate)}
                className={`
                  p-3 rounded-lg border text-center transition-all
                  ${
                    frontendTemplate === template
                      ? "border-primary bg-primary/10"
                      : "border-white/20 hover:border-white/40 bg-[#1D1D1D]/40"
                  }
                `}
              >
                <div className="text-sm font-medium text-white">
                  {info.title}
                </div>
                <div className="text-xs text-grey-text mt-1">
                  {info.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Deploy Button */}
        <div className="border-t border-white/20 pt-6">
          <button
            onClick={onDeploy}
            disabled={!isReady || isPending}
            className={`
              w-full py-3 px-4 rounded-md font-medium transition-all
              ${
                isReady && !isPending
                  ? "bg-primary text-black hover:bg-primary/90"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              }
            `}
          >
            {isPending ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deploying...
              </span>
            ) : (
              "Deploy NFT Contract"
            )}
          </button>
          {!isReady && (
            <p className="mt-2 text-sm text-grey-text text-center">
              Complete all configuration steps to enable deployment
            </p>
          )}
        </div>

        {/* Deployment Info */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary mb-2">
            What happens when you deploy?
          </h4>
          <ul className="space-y-1 text-sm text-white/80">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Your NFT contract is deployed to XION testnet</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>You become the contract admin/owner</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Integration code is generated for your chosen framework</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>Contract addresses and deployment info are provided</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}