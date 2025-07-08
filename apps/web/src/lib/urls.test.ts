import { getTemplateRepoInfo, TEMPLATE_REPO_URLS } from '@burnt-labs/quick-start-utils';

describe('getTemplateRepoInfo', () => {
  it('should return webapp repo info for webapp template', () => {
    const result = getTemplateRepoInfo('webapp');
    expect(result).toEqual(TEMPLATE_REPO_URLS.WEBAPP);
    expect(result.url).toContain('xion-user-map-json-store-frontend');
  });

  it('should return mobile repo info for mobile template', () => {
    const result = getTemplateRepoInfo('mobile');
    expect(result).toEqual(TEMPLATE_REPO_URLS.MOBILE);
    expect(result.url).toContain('abstraxion-expo-demo');
  });

  it('should return rum repo info for rum template', () => {
    const result = getTemplateRepoInfo('rum');
    expect(result).toEqual(TEMPLATE_REPO_URLS.RUM);
    expect(result.url).toContain('abstraxion-reclaim-demo');
  });

  it('should return webapp as default for unknown template', () => {
    const result = getTemplateRepoInfo('unknown-template');
    expect(result).toEqual(TEMPLATE_REPO_URLS.WEBAPP);
  });

  it('should return webapp as default for empty string', () => {
    const result = getTemplateRepoInfo('');
    expect(result).toEqual(TEMPLATE_REPO_URLS.WEBAPP);
  });
});