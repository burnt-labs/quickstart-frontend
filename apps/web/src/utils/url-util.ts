/**
 * Utility functions for URL manipulation
 */

/**
 * Builds an installation URL with the appropriate query parameters
 * 
 * @param origin - The base URL origin (e.g., window.location.origin)
 * @param userAddress - Optional user address to include in the URL
 * @param template - The frontend template to use
 * @returns A properly formatted installation URL
 */
export function buildInstallUrl(
  origin: string,
  userAddress?: string,
  template?: string
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

  // Return the URL as a string
  return url.toString();
}
