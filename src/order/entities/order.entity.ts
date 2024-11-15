import { CryptoPaymentInfo } from './crypto-payment-info.class';
import { PaymentStatus } from './payment-status.enum';
import { PaymentType } from './payment-type.enum';
import { ShippingInfo } from './shipping-info.class';
import { ShippingType } from './shipping-type.enum';

export class Order {
  id: string;
  userId: string;
  eventId: string;
  cardId: string;
  shippingType: ShippingType;
  shippingInfo?: ShippingInfo;

  subTotal: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;

  cryptoPaymentInfo?: CryptoPaymentInfo;
  isPrinted: boolean;

  paidAt?: Date;
  printedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
