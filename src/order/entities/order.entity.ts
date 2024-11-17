import { CryptoPaymentInfo } from './crypto-payment-info.class';
import { PaymentStatus } from './payment-status.enum';
import { PaymentType } from './payment-type.enum';
import { ShippingInfo } from './shipping-info.class';
import { ShippingType } from './shipping-type.enum';

export class OrderEntity {
  id: string;
  userId: string;
  eventId: string;
  cardId: string;
  note: string;
  shippingType: ShippingType;
  shippingInfo?: ShippingInfo;

  subTotal: number;
  paymentType: PaymentType = PaymentType.CRYPTO;
  paymentStatus: PaymentStatus = PaymentStatus.PENDING;

  // crypto payment info
  chain = 'kub';
  currency = 'kub';
  nativeTotal: string;

  cryptoPaymentInfo?: CryptoPaymentInfo;
  isPrinted: boolean;

  paidAt?: Date;
  txHash?: string;
  printedAt?: Date;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  expiredAt?: Date;
}
