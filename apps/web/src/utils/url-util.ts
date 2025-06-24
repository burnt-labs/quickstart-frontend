/**
 * Utility functions for URL manipulation
 */

/**
 * Builds an installation URL with the appropriate query parameters
 * 
 * @param origin - The base URL origin (e.g., window.location.origin)
 * @param userAddress - Optional user address to include in the URL
 * @param template - The frontend template to use
 * @param contractType - The type of contract (usermap or rum)
 * @param rumIndex - The RUM contract index for RUM contracts
 * @returns A properly formatted installation URL
 */
export function buildInstallUrl(
  origin: string,
  userAddress?: string,
  template?: string,
  contractType?: "usermap" | "rum",
  rumIndex?: number
): string {
  // Create a URL object with the path and origin
  const url = new URL(`/install/`, origin);

  // Add parameters if they exist
  if (userAddress) {
    url.searchParams.append('user_address', userAddress);
  }

  if (template) {
    url.searchParams.append('template', template);
  }

  if (contractType) {
    url.searchParams.append('contract_type', contractType);
  }

  if (rumIndex !== undefined && contractType === 'rum') {
    url.searchParams.append('rum_index', rumIndex.toString());
  }

  // Return the URL as a string
  return url.toString();
}
