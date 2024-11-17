import { CardTypeEnum } from '../types/card-type.enum';

// NFC card model
export class Card {
  id: string;
  code: string;
  cardName: string;
  userId: string;
  eventId?: string;
  isRedeemed: boolean;

  pinCode: string;
  pingCount: number;

  cardType: CardTypeEnum;

  createdAt?: Date;
  updatedAt?: Date;
}
