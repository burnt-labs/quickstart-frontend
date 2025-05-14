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

      const installScript = `#!/bin/bash

# Colors for output
RED='\x1b[0;31m'
GREEN='\x1b[0;32m'
YELLOW='\x1b[0;33m'
BLUE='\x1b[0;34m'
NC='\x1b[0m' # No Color

# Repository URL
REPO_URL="${repoUrl}"
REPO_NAME="${repoName}"

# Print banner
echo -e "\${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
if [ "${template}" = "mobile" ]; then
  echo "║             XION Mobile App Installer                      ║"
else
  echo "║             XION User Map Web App Installer                ║"
fi
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "\${NC}"

# Set the server URL - this will be replaced with the actual URL when the script is served
SERVER_URL="__SERVER_URL__"

# Set user address from URL parameter if provided
USER_ADDRESS="${userAddress}"

# Ask for user address if not provided
if [ -z "\${USER_ADDRESS}" ]; then
  echo -e "\${BLUE}To populate environment variables with contract addresses, please enter your wallet address (optional):\${NC}"
  read -p "Wallet address (press Enter to skip): " USER_ADDRESS
fi

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for dependencies
echo -e "\${BLUE}Checking dependencies...\${NC}"

# Check for git
if command_exists git; then
  echo -e "\${GREEN}✓ Git is installed\${NC}"
else
  echo -e "\${RED}✗ Git is not installed\${NC}"
  echo -e "\${YELLOW}Please install Git: https://git-scm.com/downloads\${NC}"
  exit 1
fi

# Check for Node.js
if command_exists node; then
  NODE_VERSION=$(node -v | cut -d 'v' -f 2)
  NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d '.' -f 1)
  if [ "$NODE_MAJOR_VERSION" -ge 18 ]; then
    echo -e "\${GREEN}✓ Node.js v$NODE_VERSION is installed\${NC}"
  else
    echo -e "\${RED}✗ Node.js v$NODE_VERSION is installed, but v18+ is required\${NC}"
    echo -e "\${YELLOW}Please upgrade Node.js: https://nodejs.org/\${NC}"
    exit 1
  fi
else
  echo -e "\${RED}✗ Node.js is not installed\${NC}"
  echo -e "\${YELLOW}Please install Node.js v18+: https://nodejs.org/\${NC}"
  exit 1
fi

# Check for npm
if command_exists npm; then
  NPM_VERSION=$(npm --version)
  echo -e "\${GREEN}✓ npm v$NPM_VERSION is installed\${NC}"
else
  echo -e "\${RED}✗ npm is not installed\${NC}"
  echo -e "\${YELLOW}Please install npm (comes with Node.js): https://nodejs.org/\${NC}"
  exit 1
fi

# Clone the repository
echo -e "\n\${BLUE}Cloning the repository...\${NC}"
if [ -d "$REPO_NAME" ]; then
  echo -e "\${YELLOW}Directory $REPO_NAME already exists.\${NC}"
  read -p "Do you want to remove it and clone again? (y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$REPO_NAME"
  else
    echo -e "\${YELLOW}Using existing directory.\${NC}"
    cd "$REPO_NAME"
    # Pull latest changes
    git pull
    cd ..
  fi
fi

if [ ! -d "$REPO_NAME" ]; then
  git clone "$REPO_URL" "$REPO_NAME"
  if [ $? -ne 0 ]; then
    echo -e "\${RED}Failed to clone the repository.\${NC}"
    exit 1
  fi
fi

# Navigate to the repository
cd "$REPO_NAME"

# Create .env.local file
echo -e "\n\${BLUE}Creating .env.local file...\${NC}"

# Get user address from the wallet
if command_exists curl; then
  # Try to fetch environment values from the server
  ENV_URL="\${SERVER_URL}/env/?template=${template}&verify=false"

  if [ -n "\${USER_ADDRESS}" ]; then
    ENV_URL="\${ENV_URL}&user_address=\${USER_ADDRESS}"
  fi

  ENV_CONTENT=$(curl -fsSL "\${ENV_URL}" 2>/dev/null)

  if [ $? -eq 0 ] && [ -n "\${ENV_CONTENT}" ]; then
    echo -e "\${GREEN}✓ Successfully fetched environment values\${NC}"
    echo "\${ENV_CONTENT}" > .env.local
  else
    echo -e "\${RED}✗ Failed to fetch environment variables from the server\${NC}"
    echo -e "\${RED}Please ensure you have a valid wallet address and try again\${NC}"
    exit 1
  fi
else
  echo -e "\${RED}✗ curl is not installed\${NC}"
  echo -e "\${RED}curl is required to fetch environment variables from the server\${NC}"
  echo -e "\${YELLOW}Please install curl and try again\${NC}"
  exit 1
fi

echo -e "\${GREEN}✓ Created .env.local file\${NC}"

# Install dependencies
echo -e "\n\${BLUE}Installing dependencies...\${NC}"
npm install
if [ $? -ne 0 ]; then
  echo -e "\${RED}Failed to install dependencies.\${NC}"
  exit 1
fi

echo -e "\${GREEN}✓ Dependencies installed successfully\${NC}"

# Success message
echo -e "\n\${GREEN}✅ Setup completed successfully!\${NC}"

if [ "${template}" = "mobile" ]; then
  echo -e "\${BLUE}Available commands for the mobile app:\${NC}"
  echo -e "  cd $REPO_NAME"
  echo -e "  npm run start     # Start the Expo development server"
  echo -e "  npm run android   # Run on Android"
  echo -e "  npm run ios       # Run on iOS"
  echo -e "  npm run web       # Run on web browser"
  echo -e "  npm run test      # Run tests"
  echo -e "  npm run lint      # Run linter"
else
  echo -e "\${BLUE}To start the development server:\${NC}"
  echo -e "  cd $REPO_NAME"
  echo -e "  npm run dev"
  echo -e "\n\${BLUE}To build the project:\${NC}"
  echo -e "  cd $REPO_NAME"
  echo -e "  npm run build"
fi

# Note about contract addresses
echo -e "\n\${BLUE}Note: Your .env.local file has been populated with contract addresses.\${NC}"
echo -e "\${BLUE}If you need to use different contract addresses, you can edit the .env.local file.\${NC}"
`;

      // Replace the placeholder with the actual server URL
      const serverUrl = url.origin;
      const modifiedScript = installScript.replace("__SERVER_URL__", serverUrl);

      return new Response(modifiedScript, {
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
