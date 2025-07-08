import { generateTreasuryInitMsg } from "./treasury";
import { REDIRECT_URLS } from "@burnt-labs/quick-start-utils";

describe("Treasury Contract URL Configuration", () => {
  const defaultParams = {
    adminAddress: "xion1test123",
    contractAddresses: ["xion1contract123"],
    redirectUrl: REDIRECT_URLS.WEB,
  };

  it("should accept redirect URL parameter", () => {
    const initMsg = generateTreasuryInitMsg(defaultParams);
    
    expect(initMsg.redirect_url).toBe(REDIRECT_URLS.WEB);
    expect(initMsg.params.redirect_url).toBe(REDIRECT_URLS.WEB);
  });

  it("should accept different URL formats", () => {
    const testUrls = [
      "https://example.com",
      "https://app.example.com",
      "https://example.com/path",
      "https://example.com:8080",
      "http://localhost:5173",
    ];

    testUrls.forEach(url => {
      const initMsg = generateTreasuryInitMsg({
        ...defaultParams,
        redirectUrl: url,
      });
      
      expect(initMsg.redirect_url).toBe(url);
      expect(initMsg.params.redirect_url).toBe(url);
    });
  });

  it("should work with predefined redirect URL constants", () => {
    const urlConfigs = [
      { redirectUrl: REDIRECT_URLS.WEB, name: "Web" },
      { redirectUrl: REDIRECT_URLS.MOBILE, name: "Mobile" },
      { redirectUrl: REDIRECT_URLS.RUM, name: "RUM" },
    ];

    urlConfigs.forEach(({ redirectUrl }) => {
      const initMsg = generateTreasuryInitMsg({
        ...defaultParams,
        redirectUrl,
      });
      
      expect(initMsg.redirect_url).toBe(redirectUrl);
      expect(initMsg.params.redirect_url).toBe(redirectUrl);
    });
  });

  it("should generate proper treasury init message structure", () => {
    const initMsg = generateTreasuryInitMsg({
      ...defaultParams,
      redirectUrl: "https://myapp.com",
      description: "Test description",
      feeDescription: "Test fee description",
    });

    // Check overall structure
    expect(initMsg).toHaveProperty("admin", defaultParams.adminAddress);
    expect(initMsg).toHaveProperty("redirect_url", "https://myapp.com");
    expect(initMsg).toHaveProperty("params");
    expect(initMsg).toHaveProperty("type_urls");
    expect(initMsg).toHaveProperty("grant_configs");
    expect(initMsg).toHaveProperty("fee_config");

    // Check params structure
    expect(initMsg.params).toHaveProperty("redirect_url", "https://myapp.com");
    expect(initMsg.params).toHaveProperty("icon_url");
    expect(initMsg.params).toHaveProperty("metadata", "{}");

    // Check grant configs
    expect(initMsg.grant_configs).toHaveLength(1);
    expect(initMsg.grant_configs[0]).toHaveProperty("description", "Test description");
    expect(initMsg.grant_configs[0]).toHaveProperty("optional", false);
    expect(initMsg.grant_configs[0]).toHaveProperty("authorization");

    // Check fee config
    expect(initMsg.fee_config).toHaveProperty("description", "Test fee description");
    expect(initMsg.fee_config).toHaveProperty("allowance");
  });
});