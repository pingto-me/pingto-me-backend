// NFC card model
export class Card {
  id: string;
  code: string;
  cardName: string;
  userId: string;
  eventId?: string;
  isRedeemed: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
