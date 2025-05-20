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
      const template = url.searchParams.get("template") || FRONTEND_TEMPLATES.WEBAPP;

      // Set repository URL based on template
      const repoUrl = template === FRONTEND_TEMPLATES.MOBILE 
        ? "https://github.com/burnt-labs/abstraxion-expo-demo.git"
        : "https://github.com/burnt-labs/xion-user-map-json-store-frontend.git";

      const repoName = template === FRONTEND_TEMPLATES.MOBILE 
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
        .replace(/{{userAddress}}/g, userAddress);

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

    const saltEncoded = new TextEncoder().encode(config.salt);

    const appAddress = predictInstantiate2Address({
      senderAddress: params.user_address,
      checksum: config.app_checksum,
      salt: saltEncoded,
    });

    const treasuryAddress = predictInstantiate2Address({
      senderAddress: params.user_address,
      checksum: config.treasury_checksum,
      salt: saltEncoded,
    });

    // Skip verification if verify=false in the query parameters
    if (config.verify) {
      const appExists = await verifyContractExists({
        address: appAddress,
        restUrl: REST_URL,
      });

      const treasuryExists = await verifyContractExists({
        address: treasuryAddress,
        restUrl: REST_URL,
      });

      if (!appExists || !treasuryExists) {
        return new Response("Contract does not exist", { status: 400 });
      }
    }

    if (url.pathname.startsWith("/env/")) {
      const envText = formatEnvText(
        {
          appAddress,
          treasuryAddress,
        },
        config.template,
        import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443",
        import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com"
      );

      if (config.values_only) {
        return Response.json({ appAddress, treasuryAddress });
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
