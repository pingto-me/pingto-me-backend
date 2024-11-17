/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { BlockscoutConfig, CHAINS, NFTS } from '../configs/blockscout.config';
const _ = require('lodash');

@Injectable()
export class BlockscoutService {
  private readonly logger = new Logger(BlockscoutService.name);

  /**
   * Get the chain configuration by name
   * @param chainSymbol - Name of the chain
   */
  private getChainConfig(chainSymbol: string): BlockscoutConfig | null {
    return CHAINS.find((chain) => chain.symbol === chainSymbol) || null;
  }

  /**
   * Generate a URL to link to an address
   * @param chainName - Name of the chain
   * @param address - Ethereum address
   */
  getAddressUrl(chainName: string, address: string): string | null {
    const chainConfig = this.getChainConfig(chainName);
    if (!chainConfig) {
      this.logger.warn(`Chain ${chainName} not found`);
      return null;
    }
    return `${chainConfig.baseUrl.replace('/api', '')}/address/${address}`;
  }

  /**
   * Generate a URL to link to a transaction hash
   * @param chainName - Name of the chain
   * @param hash - Transaction hash
   */
  getHashUrl(chainName: string, hash: string): string | null {
    const chainConfig = this.getChainConfig(chainName);
    if (!chainConfig) {
      this.logger.warn(`Chain ${chainName} not found`);
      return null;
    }
    return `${chainConfig.baseUrl.replace('/api', '')}/tx/${hash}`;
  }

  /**
   * Find NFTs by owner address
   * @param chainSymbol - Name of the chain
   * @param ownerAddress - Ethereum address of the NFT owner
   */
  async findNFTsByOwner(
    chainSymbol: string,
    ownerAddress: string,
  ): Promise<any> {
    const chainConfig = this.getChainConfig(chainSymbol);
    if (!chainConfig) {
      this.logger.warn(`Chain ${chainSymbol} not found`);
      return null;
    }

    let url = `${chainConfig.baseUrl}/addresses/${ownerAddress}/nft?type=ERC-721,ERC-404,ERC-1155`;
    if (chainConfig.apiKey !== '' && chainConfig.apiKey !== null) {
      url += `&apikey=${chainConfig.apiKey}`;
    }
    // const url = `${chainConfig.baseUrl}?module=account&action=tokennfttx&address=${ownerAddress}&apikey=${chainConfig.apiKey}`;
    Logger.debug('url', url);
    try {
      const response = await axios.get(url);
      const rawData = response.data;

      let items = rawData.items;
      if (NFTS.length > 0) {
        items = _.filter(rawData.items, (item) =>
          _.some(NFTS, { address: item.token.address, chain: chainSymbol }),
        );
      }

      const result = {
        items,
      };

      return result || [];
    } catch (error) {
      this.logger.error(
        `Error fetching NFTs for owner ${ownerAddress}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Check NFT ownership
   * @param chainName - Name of the chain
   * @param contractAddress - NFT contract address
   * @param tokenId - Token ID of the NFT
   * @param ownerAddress - Expected owner address
   */
  async checkNFTOwnership(
    chainName: string,
    contractAddress: string,
    tokenId: string,
    ownerAddress: string,
  ): Promise<boolean> {
    const chainConfig = this.getChainConfig(chainName);
    if (!chainConfig) {
      this.logger.warn(`Chain ${chainName} not found`);
      return false;
    }

    const url = `${chainConfig.baseUrl}?module=token&action=tokennftinfo&contractaddress=${contractAddress}&tokenid=${tokenId}&apikey=${chainConfig.apiKey}`;
    try {
      const response = await axios.get(url);
      const nftData = response.data.result;
      return (
        nftData && nftData.owner.toLowerCase() === ownerAddress.toLowerCase()
      );
    } catch (error) {
      this.logger.error(
        `Error checking NFT ownership for contract ${contractAddress}, token ${tokenId}, owner ${ownerAddress}:`,
        error,
      );
      return false;
    }
  }
}
