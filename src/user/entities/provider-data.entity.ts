/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseEntityModel } from 'src/common/models/base.entity.model';
import { ProviderData } from 'src/models/provider-data';
import { Provider } from 'src/models/provider.enum';

export class ProviderDataEntity
  extends BaseEntityModel
  implements ProviderData
{
  userId: string;
  uid?: string;
  provider: Provider;
  email?: string;
  forgetPasswordCode?: string;
  providerId?: string;
  providerToken?: string;
  providerProfile?: any;
  walletAddress?: string;
  nonce?: string;
  accountRawData?: any;
  isVerified?: boolean;
}
