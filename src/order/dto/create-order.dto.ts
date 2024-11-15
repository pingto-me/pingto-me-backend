import { PaymentType } from '../entities/payment-type.enum';
import { ShippingType } from '../entities/shipping-type.enum';

export class CreateOrderDto {
  userId: string;
  cardId: string;

  note?: string;

  shippingType: ShippingType = ShippingType.PICKUP;

  subtotal: string;
  paymentType: PaymentType = PaymentType.CRYPTO;

  chain: string;
}
