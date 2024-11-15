export class Event {
  id: string;
  name: string;
  description: string;
  eventType: EventTarget;
  isEable: boolean;
  ownerId: string;
  cardTemplateId: string;

  createdAt?: Date;
  updatedAt?: Date;
}
