export interface BlockscoutConfig {
  name: string;
  symbol: string;
  baseUrl: string;
  apiKey: string;
}

export const CHAINS: BlockscoutConfig[] = [
  {
    name: 'Bitkub',
    symbol: 'bkc',
    baseUrl: 'https://www.bkcscan.com/api/v2',
    apiKey: '',
  },
  {
    name: 'Base',
    symbol: 'base',
    baseUrl: 'https://base.blockscout.com/api/v2',
    apiKey: '718cf41d-c9d9-4055-af1a-b4e2ee6e50c8',
  },
  // Add more chains as needed
];

export interface NftWhitelist {
  chain: string;
  address: string;
}

export const NFTS: NftWhitelist[] = [
  {
    chain: 'bkc',
    address: '0xd08Ac40b3a0A7fb20b026A3b6Cd5D7cFadc3d6f5',
  },
  {
    chain: 'base',
    address: '0xD0B816CFBDaaB92d34227985fceDD438A390B461',
  },
];
