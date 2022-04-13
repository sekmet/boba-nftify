export function classNames(...classes: string[]): string | undefined {
  return classes.filter(Boolean).join(' ');
}

export function ellipsisAddress(address: string) {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
}