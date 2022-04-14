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

export function getBobaExplorer(network_mode: string, kind: string, hash: string) {

  if (kind === 'address') {
  
      if (network_mode === 'mainnet')
          return `https://blockexplorer.boba.network/address/${hash}`
      else
          return `https://blockexplorer.rinkeby.boba.network/address/${hash}`

  }

  if (kind === 'tx') {
  
      if (network_mode === 'mainnet')
          return `https://blockexplorer.boba.network/tx/${hash}`
      else
          return `https://blockexplorer.rinkeby.boba.network/tx/${hash}`

  }

  return '';
}