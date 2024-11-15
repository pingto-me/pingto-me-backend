import { CardTemplateType } from '../../models/card-template-type.enum';

export class CardTemplate {
  id: string;
  name: string;
  templateType: CardTemplateType;
  eventId?: string;
  ownerId: string;
  readonly: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
