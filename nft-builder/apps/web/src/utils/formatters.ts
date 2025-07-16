export function formatEnvText(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

export function formatAddress(address: string, length = 10): string {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

export function formatTokenAmount(amount: string, decimals = 6): string {
  const value = parseInt(amount) / Math.pow(10, decimals);
  return value.toLocaleString();
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}