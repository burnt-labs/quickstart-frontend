import { predictInstantiate2Address } from "../src/lib/predictInstantiate2Address";
import {
  INSTANTIATE_CHECKSUMS,
  INSTANTIATE_SALT,
  FRONTEND_TEMPLATES,
} from "../src/config/constants";

// required params for the instantiate2 call
interface Config {
  app_checksum: string;
  treasury_checksum: string;
  salt: string;
  download: boolean;
  template: FRONTEND_TEMPLATES;
  verify: boolean;
}

// params from the request - defaults to the values in defaultConfig
interface RequestParams {
  user_address: string;
  app_checksum?: string;
  treasury_checksum?: string;
  salt?: string;
  download?: boolean;
  template?: FRONTEND_TEMPLATES;
  verify?: boolean;
}

const defaultConfig: Config = {
  app_checksum: INSTANTIATE_CHECKSUMS.userMap,
  treasury_checksum: INSTANTIATE_CHECKSUMS.treasury,
  salt: INSTANTIATE_SALT,
  download: false,
  template: FRONTEND_TEMPLATES.NEXTJS,
  verify: false,
};

function getConfigFromParams(params: URLSearchParams): RequestParams {
  return {
    user_address: params.get("user_address") || "",
    app_checksum: params.get("app_checksum") || undefined,
    treasury_checksum: params.get("treasury_checksum") || undefined,
    salt: params.get("salt") || undefined,
    download: params.has("download"),
    template: params.get("template") as FRONTEND_TEMPLATES | undefined,
    verify: params.has("verify"),
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
  };
}

export default {
  fetch(request) {
    const url = new URL(request.url);
    const params = getConfigFromParams(url.searchParams);

    if (!params.user_address) {
      return new Response("User address is required", { status: 400 });
    }

    const config = mergeConfigWithDefaults(params);
    const saltEncoded = new TextEncoder().encode(config.salt);

    const returnValue = JSON.stringify({
      ...config,
      user_address: params.user_address,
      saltEncoded,
    });

    // const appAddress = predictInstantiate2Address({
    //   senderAddress: params.user_address,
    //   checksum: config.app_checksum,
    //   salt: saltEncoded,
    // });

    // const treasuryAddress = predictInstantiate2Address({
    //   senderAddress: params.user_address,
    //   checksum: config.treasury_checksum,
    //   salt: saltEncoded,
    // });

    if (url.pathname.startsWith("/env/")) {
      return new Response(returnValue, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
