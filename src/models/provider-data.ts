import { Provider } from './provider.enum';

export interface ProviderData {
  id: string;
  userId: string;
  provider: Provider;
  uid?: string; // Firebase user
  email?: string; // Email provider
  forgetPasswordCode?: string; // Email provider
  providerId?: string; // Google, Gitlab provider
  providerToken?: string; // Google, Gitlab provider
  providerProfile?: any; // Google, Gitlab provider
  walletAddress?: string; // Wallet
  nonce?: string; // Wallet
  accountRawData?: any; // Wallet
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
