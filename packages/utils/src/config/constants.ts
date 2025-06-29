const CURRENT_VERSION = "0.0.2";

type Version = {
  salt: string;
  checksums: {
    userMap: string;
    treasury: string;
    rum?: string;
  };
};

// Track the versions of the contracts with salt for address prediction
export const VERSIONS: Record<string, Version> = {
  "0.0.1": {
    salt: "salt7",
    checksums: {
      userMap:
        "9302D2D7F67A505520E78E95467D70CAA9366C7DEE2F6EE8592205A4D3B1EDD1",
      treasury:
        "34C0515D8D5FFC3A37FFA71F24A3EE3CC10708DF8A9DD3E938610CD343524F78",
    },
  },
  "0.0.2": {
    salt: "xion-rocks",
    checksums: {
      userMap:
        "9302D2D7F67A505520E78E95467D70CAA9366C7DEE2F6EE8592205A4D3B1EDD1",
      treasury:
        "54992CD737BF824341F7EEFB1C5A81E4CEDD7565A7F196D688BAF7D3BAC49F21",
      rum:
        "5A591A4DF6F433728AE43896C3777D05EC9287019CB3953051A9AB52297C2B20",
    },
  },
};

export const INSTANTIATE_SALT = VERSIONS[CURRENT_VERSION].salt;
export const INSTANTIATE_CHECKSUMS = VERSIONS[CURRENT_VERSION].checksums;

export enum FRONTEND_TEMPLATES {
  WEBAPP = "webapp",
  MOBILE = "mobile",
  RUM = "rum",
}

export type FrontendTemplate =
  (typeof FRONTEND_TEMPLATES)[keyof typeof FRONTEND_TEMPLATES];

export const DEFAULT_FRONTEND_TEMPLATE: FrontendTemplate =
  FRONTEND_TEMPLATES.WEBAPP;
