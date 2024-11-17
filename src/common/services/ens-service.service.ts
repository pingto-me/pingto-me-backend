import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class ENSService {
  private readonly provider: ethers.providers.Provider;
  private readonly logger = new Logger(ENSService.name);

  constructor() {
    // Connect to Ethereum Mainnet or your preferred network
    this.provider = ethers.getDefaultProvider('https://eth.llamarpc.com'); // Change to your network if needed
  }

  /**
   * Resolves an ENS name to an Ethereum address
   * @param ensName - The ENS name to resolve
   * @returns Ethereum address or null if not found
   */
  async resolveName(ensName: string): Promise<string | null> {
    this.logger.log(`Resolving ENS name: ${ensName}`);
    try {
      const address = await this.provider.resolveName(ensName);
      return address;
    } catch (error) {
      this.logger.error(`Error resolving ENS name: ${ensName}`, error);
      return null;
    }
  }

  /**
   * Resolves an Ethereum address to an ENS name
   * @param address - The Ethereum address to reverse lookup
   * @returns ENS name or null if not found
   */
  async lookupAddress(address: string): Promise<string | null> {
    this.logger.log(`Performing reverse lookup for address: ${address}`);
    try {
      const ensName = await this.provider.lookupAddress(address);
      return ensName;
    } catch (error) {
      this.logger.error(
        `Error performing reverse lookup for address: ${address}`,
        error,
      );
      return null;
    }
  }
}
