import { EventType } from './event-type.enum';

export class Event {
  id: string;
  name: string;
  description: string;
  eventType: EventType;
  isEnable: boolean;
  ownerId: string;
  cardTemplateId: string;

  createdAt?: Date;
  updatedAt?: Date;
}
