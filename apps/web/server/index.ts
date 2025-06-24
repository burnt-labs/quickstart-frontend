import {
  INSTANTIATE_CHECKSUMS,
  INSTANTIATE_SALT,
  DEFAULT_FRONTEND_TEMPLATE,
  FRONTEND_TEMPLATES,
  type FrontendTemplate,
} from "../src/config/constants";
import {
  formatEnvText,
  predictInstantiate2Address,
  verifyContractExists,
} from "@burnt-labs/quick-start-utils";
import installerTemplate from "../templates/installer.sh.template?raw";
import { formatEnvTextWithRum } from "../src/utils/formatEnvText";
import { predictRumAddress } from "../src/lib/rum";

const REST_URL = import.meta.env.VITE_REST_URL;

/* types */

// required params for the instantiate2 call
interface Config {
  app_checksum: string;
  treasury_checksum: string;
  salt: string;
  download: boolean;
  template: FrontendTemplate;
  verify: boolean;
  values_only: boolean;
}

// params from the request - defaults to the values in defaultConfig
interface RequestParams {
  user_address: string;
  app_checksum?: string;
  treasury_checksum?: string;
  salt?: string;
  download?: boolean;
  template?: FrontendTemplate;
  verify?: boolean;
  values_only?: boolean;
  contract_type?: "usermap" | "rum";
  rum_index?: string;
}

const defaultConfig: Config = {
  app_checksum: INSTANTIATE_CHECKSUMS.userMap,
  treasury_checksum: INSTANTIATE_CHECKSUMS.treasury,
  salt: INSTANTIATE_SALT,
  download: false,
  template: DEFAULT_FRONTEND_TEMPLATE,
  verify: true,
  values_only: false,
};

/* utils */

function validateParams(params: RequestParams): {
  isValid: boolean;
  error?: string;
} {
  if (!params.user_address || params.user_address.length < 43) {
    return {
      isValid: false,
      error: "User address must be at least 43 characters long",
    };
  }
  return { isValid: true };
}

function getConfigFromParams(params: URLSearchParams): RequestParams {
  return {
    user_address: params.get("user_address") || "",
    app_checksum: params.get("app_checksum") || undefined,
    treasury_checksum: params.get("treasury_checksum") || undefined,
    salt: params.get("salt") || undefined,
    download: params.has("download")
      ? params.get("download") === "true"
      : undefined,
    template: params.get("template") as FrontendTemplate | undefined,
    verify: params.has("verify") ? params.get("verify") === "true" : undefined,
    values_only: params.has("values_only")
      ? params.get("values_only") === "true"
      : undefined,
    contract_type: params.get("contract_type") as "usermap" | "rum" | undefined,
    rum_index: params.get("rum_index") || undefined,
  };
}

function mergeConfigWithDefaults(params: RequestParams): Config {
  return {
    app_checksum: params.app_checksum || defaultConfig.app_checksum,
    treasury_checksum:
      params.treasury_checksum || defaultConfig.treasury_checksum,
    salt: params.salt || defaultConfig.salt,
    download: params.download ?? defaultConfig.download,
    template: params.template || defaultConfig.template,
    verify: params.verify ?? defaultConfig.verify,
    values_only: params.values_only ?? defaultConfig.values_only,
  };
}

/* handlers */
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Handle install.sh script request
    if (url.pathname.startsWith("/install/")) {
      // Get user_address and template from query parameters if available
      const userAddress = url.searchParams.get("user_address") || "";
      const contractType = url.searchParams.get("contract_type") || "usermap";
      
      // Template is always mobile for RUM, otherwise from URL or default to webapp
      const template = contractType === "rum" 
        ? FRONTEND_TEMPLATES.MOBILE
        : (url.searchParams.get("template") || FRONTEND_TEMPLATES.WEBAPP);
      

      // Set repository URL based on template
      const repoUrl =
        template === FRONTEND_TEMPLATES.MOBILE
          ? "https://github.com/burnt-labs/abstraxion-expo-demo.git"
          : "https://github.com/burnt-labs/xion-user-map-json-store-frontend.git";

      const repoName =
        template === FRONTEND_TEMPLATES.MOBILE
          ? "xion-mobile-quickstart"
          : "xion-web-quickstart";

      // Use the imported template
      let templateContent = installerTemplate;

      // Replace placeholders with actual values
      const serverUrl = url.origin;
      templateContent = templateContent
        .replace(/{{repoUrl}}/g, repoUrl)
        .replace(/{{repoName}}/g, repoName)
        .replace(/{{template}}/g, template)
        .replace(/{{serverUrl}}/g, serverUrl)
        .replace(/{{userAddress}}/g, userAddress)
        .replace(/{{contractType}}/g, contractType);

      return new Response(templateContent, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    const params = getConfigFromParams(url.searchParams);

    const validation = validateParams(params);
    if (!validation.isValid) {
      return new Response(validation.error, { status: 400 });
    }

    const config = mergeConfigWithDefaults(params);

    // Always predict both contract addresses
    const saltEncoded = new TextEncoder().encode(config.salt);
    
    const userMapAddress = predictInstantiate2Address({
      senderAddress: params.user_address,
      checksum: config.app_checksum,
      salt: saltEncoded,
    });

    const rumAddress = predictRumAddress(params.user_address, config.salt);

    const treasuryAddress = predictInstantiate2Address({
      senderAddress: params.user_address,
      checksum: config.treasury_checksum,
      salt: saltEncoded,
    });

    // For backward compatibility, set appAddress based on contract_type
    const appAddress = params.contract_type === "rum" ? rumAddress : userMapAddress;

    // Skip verification if verify=false in the query parameters
    let userMapExists = false;
    let rumExists = false;
    let treasuryExists = false;
    
    if (config.verify) {
      // Check UserMap contract
      userMapExists = await verifyContractExists({
        address: userMapAddress,
        restUrl: REST_URL,
      });

      // Check RUM contract
      rumExists = await verifyContractExists({
        address: rumAddress,
        restUrl: REST_URL,
      });

      // Check treasury contract
      treasuryExists = await verifyContractExists({
        address: treasuryAddress,
        restUrl: REST_URL,
      });

      // For backward compatibility, check based on contract_type
      const appExists = params.contract_type === "rum" ? rumExists : userMapExists;
      
      if (!appExists || !treasuryExists) {
        return new Response("Contract does not exist", { status: 400 });
      }
    }

    if (url.pathname.startsWith("/env/")) {
      let envText: string;
      
      
      if (params.contract_type === "rum") {
        // Use RUM-specific formatting
        envText = formatEnvTextWithRum(
          {
            appAddress,
            treasuryAddress,
          },
          config.template,
          import.meta.env.VITE_RPC_URL ||
            "https://rpc.xion-testnet-2.burnt.com:443",
          import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com",
          "rum"
        );
      } else {
        // Use regular User Map formatting
        envText = formatEnvText(
          {
            appAddress,
            treasuryAddress,
          },
          config.template,
          import.meta.env.VITE_RPC_URL ||
            "https://rpc.xion-testnet-2.burnt.com:443",
          import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com"
        );
      }

      if (config.values_only) {
        // Return all contract addresses if they exist
        const response: any = {};
        
        if (!config.verify || (userMapExists && treasuryExists)) {
          response.appAddress = userMapAddress;
          response.treasuryAddress = treasuryAddress;
        }
        
        if (!config.verify || rumExists) {
          response.rumAddress = rumAddress;
        }
        
        // Return null if no contracts exist
        if (Object.keys(response).length === 0) {
          return Response.json(null);
        }
        
        return Response.json(response);
      }

      const headers: Record<string, string> = {
        "Content-Type": "text/plain",
      };

      if (config.download) {
        headers["Content-Disposition"] = "attachment; filename=.env.local";
      }

      return new Response(envText, { headers });
    }
    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
