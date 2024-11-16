import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';

@Injectable()
export class PushService {
  private wallet: ethers.Wallet;

  constructor() {
    // Initialize Ethereum wallet using the channel's private key
    const privateKey = process.env.PUSH_CHANNEL_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error(
        'PUSH_CHANNEL_PRIVATE_KEY is not defined in the environment.',
      );
    }
    this.wallet = new ethers.Wallet(privateKey);
  }

  async sendNotification(
    targetAddress: string,
    title: string,
    body: string,
  ): Promise<any> {
    try {
      const response = await PushAPI.payloads.sendNotification({
        signer: this.wallet,
        type: 3, // Notification type (3 for a subset of recipients)
        identityType: 2, // Direct wallet notification
        notification: {
          title,
          body,
        },
        payload: {
          title,
          body,
          cta: '', // Call to Action (Optional)
          img: '', // Image URL (Optional)
        },
        recipients: targetAddress, // Target wallet address
        channel: process.env.PUSH_CHANNEL_ADDRESS, // Push channel address
        env: ENV.DEV, // Use 'staging' for testing
      });

      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification.');
    }
  }
}
