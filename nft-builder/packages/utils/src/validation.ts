export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidIpfsUrl(url: string): boolean {
  return url.startsWith('ipfs://') || url.startsWith('https://ipfs.io/');
}

export function validateAssetName(name: string): string | null {
  if (!name) return 'Name is required';
  if (name.length < 3) return 'Name must be at least 3 characters';
  if (name.length > 50) return 'Name must be less than 50 characters';
  return null;
}

export function validateAssetSymbol(symbol: string): string | null {
  if (!symbol) return 'Symbol is required';
  if (symbol.length < 2) return 'Symbol must be at least 2 characters';
  if (symbol.length > 10) return 'Symbol must be less than 10 characters';
  if (!/^[A-Z0-9]+$/.test(symbol)) return 'Symbol must be uppercase letters and numbers only';
  return null;
}

export function validateSupply(supply: number): string | null {
  if (!supply || supply < 1) return 'Supply must be at least 1';
  if (supply > 1000000) return 'Supply must be less than 1,000,000';
  if (!Number.isInteger(supply)) return 'Supply must be a whole number';
  return null;
}

export function validateRoyaltyPercentage(percentage: number): string | null {
  if (percentage < 0) return 'Royalty percentage cannot be negative';
  if (percentage > 50) return 'Royalty percentage cannot exceed 50%';
  return null;
}