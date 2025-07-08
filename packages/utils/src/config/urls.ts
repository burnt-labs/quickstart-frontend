// Redirect URLs for different treasury types
export const REDIRECT_URLS = {
  WEB: "http://localhost:3000",
  MOBILE: "abstraxionreclaimdemo://",
  RUM: "abstraxionreclaimdemo://",
} as const;

// Repository URLs for different frontend templates
export const TEMPLATE_REPO_URLS = {
  WEBAPP: {
    url: "https://github.com/burnt-labs/xion-user-map-json-store-frontend.git",
    name: "xion-web-quickstart",
  },
  MOBILE: {
    url: "https://github.com/burnt-labs/abstraxion-expo-demo.git",
    name: "xion-mobile-quickstart",
  },
  RUM: {
    url: "https://github.com/burnt-labs/abstraxion-reclaim-demo.git",
    name: "xion-rum-quickstart",
  },
} as const;

// API URLs (these come from environment variables but have defaults)
export const DEFAULT_API_URLS = {
  REST: "https://api.xion-testnet-2.burnt.com",
  RPC: "https://rpc.xion-testnet-2.burnt.com:443",
} as const;

export type RedirectUrl = (typeof REDIRECT_URLS)[keyof typeof REDIRECT_URLS];
export type TemplateRepo = {
  readonly url: string;
  readonly name: string;
};

/**
 * Get template repository information based on template type
 * @param template - The template type (webapp, mobile, or rum)
 * @returns Repository URL and name for the template
 * @example
 * const repoInfo = getTemplateRepoInfo("mobile");
 * console.log(repoInfo.url); // "https://github.com/burnt-labs/abstraxion-expo-demo.git"
 */
export function getTemplateRepoInfo(template: string): TemplateRepo {
  switch (template) {
    case "webapp":
      return TEMPLATE_REPO_URLS.WEBAPP;
    case "mobile":
      return TEMPLATE_REPO_URLS.MOBILE;
    case "rum":
      return TEMPLATE_REPO_URLS.RUM;
    default:
      return TEMPLATE_REPO_URLS.WEBAPP;
  }
}