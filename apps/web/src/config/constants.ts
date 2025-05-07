const CURRENT_VERSION = "0.0.1";

type Version = {
  salt: string;
  checksums: {
    userMap: string;
    treasury: string;
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
};

export const INSTANTIATE_SALT = VERSIONS[CURRENT_VERSION].salt;
